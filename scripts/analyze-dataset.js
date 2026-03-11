import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_DIR = '/Users/alexandrucojanu/Desktop/batch_mirrors/website-uri-scrapate';
const OUTPUT_FILE = path.join(__dirname, '..', 'design-palette.json');

async function analyzeDataset() {
    console.log(`Starting analysis of dataset across ${DATASET_DIR}`);
    
    if (!fs.existsSync(DATASET_DIR)) {
        console.error(`Dataset directory not found: ${DATASET_DIR}`);
        return;
    }

    const projects = fs.readdirSync(DATASET_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
        .map(dirent => dirent.name);

    console.log(`Found ${projects.length} projects to analyze.`);

    const globalPatterns = {
        fontFamilies: new Set(),
        colorHexes: new Set(),
        componentTypes: new Set(),
        commonClasses: new Set()
    };

    for (const project of projects) {
        const projectPath = path.join(DATASET_DIR, project);
        console.log(`Analyzing project: ${project}`);
        
        // 1. Analyze global CSS/Astro configs for fonts and root colors
        analyzeCss(projectPath, globalPatterns);
        
        // 2. Analyze components
        analyzeComponents(projectPath, globalPatterns);
    }

    // Convert sets to arrays for JSON serialization
    const result = {
        totalProjectsAnalyzed: projects.length,
        fontFamilies: Array.from(globalPatterns.fontFamilies),
        colorHexes: Array.from(globalPatterns.colorHexes),
        componentTypes: Array.from(globalPatterns.componentTypes),
        commonTailwindClasses: Array.from(globalPatterns.commonClasses)
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`\nAnalysis complete. Results saved to ${OUTPUT_FILE}`);
}

function analyzeCss(projectPath, patterns) {
    const srcPath = path.join(projectPath, 'src');
    if (!fs.existsSync(srcPath)) return;
    
    // Very basic regex to look for hex colors and font-family in any file
    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
    const fontRegex = /font-family:\s*([^;]+);/g;
    
    const walkSync = (dir, filelist = []) => {
        if (!fs.existsSync(dir)) return filelist;
        fs.readdirSync(dir).forEach(file => {
            const filepath = path.join(dir, file);
            if (fs.statSync(filepath).isDirectory()) {
                filelist = walkSync(filepath, filelist);
            } else {
                filelist.push(filepath);
            }
        });
        return filelist;
    };

    const files = walkSync(srcPath);
    
    for (const file of files) {
        if (!file.endsWith('.css') && !file.endsWith('.astro')) continue;
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Extract Hex Colors
            let hexMatch;
            while ((hexMatch = hexRegex.exec(content)) !== null) {
                patterns.colorHexes.add(hexMatch[0].toLowerCase());
            }

            // Extract Font Families
            let fontMatch;
            while ((fontMatch = fontRegex.exec(content)) !== null) {
                // primitive cleanup
                const font = fontMatch[1].replace(/['"]/g, '').split(',')[0].trim();
                patterns.fontFamilies.add(font);
            }
        } catch (e) {
            // ignore read errors
        }
    }
}

function analyzeComponents(projectPath, patterns) {
    const compPath = path.join(projectPath, 'src', 'components');
    if (!fs.existsSync(compPath)) return;

    fs.readdirSync(compPath).forEach(file => {
        if (file.endsWith('.astro') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
            patterns.componentTypes.add(file.replace(/\.[^/.]+$/, ""));
        }
    });
}

analyzeDataset().catch(console.error);
