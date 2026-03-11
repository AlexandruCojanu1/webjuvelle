import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_DIR = '/Users/alexandrucojanu/Desktop/batch_mirrors/knowledge';
const OUTPUT_FILE = path.join(__dirname, '..', 'design-principles.json');

function extractMarkdownHeadings(content) {
    const lines = content.split('\n');
    const tips = [];
    let currentTip = '';
    
    for (const line of lines) {
        // Match Markdown headings (e.g. ### Tip Name)
        if (line.match(/^#{2,4}\s+(.*)/)) {
            if (currentTip) tips.push(currentTip.trim());
            currentTip = line.replace(/^#{2,4}\s+/, '').trim();
        }
    }
    if (currentTip) tips.push(currentTip.trim());
    return tips;
}

function analyzeKnowledge() {
    console.log(`Starting knowledge extraction from ${KNOWLEDGE_DIR}`);
    const principles = {
        cssProtips: [],
        designPatterns: []
    };

    // 1. Analyze CSS Protips
    const cssRepoPath = path.join(KNOWLEDGE_DIR, 'css-protips', 'README.md');
    if (fs.existsSync(cssRepoPath)) {
        console.log('Extracting CSS Protips...');
        const content = fs.readFileSync(cssRepoPath, 'utf8');
        // Extract links from the table of contents as "tips"
        const matches = content.match(/\[([^\]]+)\]\(#[^\)]+\)/g);
        if (matches) {
            principles.cssProtips = matches.map(m => {
                const textMatch = m.match(/\[([^\]]+)\]/);
                return textMatch ? textMatch[1] : null;
            }).filter(t => t && !t.includes('Translations') && !t.includes('Support'));
        }
    }

    // 2. Analyze Awesome Design Patterns
    const uxRepoPath = path.join(KNOWLEDGE_DIR, 'awesome-design-patterns', 'README.md');
    if (fs.existsSync(uxRepoPath)) {
        console.log('Extracting UI/UX Design Patterns...');
        const content = fs.readFileSync(uxRepoPath, 'utf8');
        
        // Match unordered list items that look like pattern descriptions
        const listItems = content.match(/^[*-]\s+\[([^\]]+)\][^\n]+/gm);
        if (listItems) {
            principles.designPatterns = listItems.map(item => {
                 // Extract just the phrase inside the brackets for the pattern name
                 const match = item.match(/\[([^\]]+)\]/);
                 return match ? match[1] : null;
            }).filter(Boolean);
        }
    }

    // Limit the items so the AI context doesn't blow up
    principles.cssProtips = principles.cssProtips.slice(0, 20);
    principles.designPatterns = [...new Set(principles.designPatterns)].slice(0, 25);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(principles, null, 2));
    console.log(`\nExtraction complete. Results saved to ${OUTPUT_FILE}`);
    console.log(`Extracted ${principles.cssProtips.length} CSS tips and ${principles.designPatterns.length} UX patterns.`);
}

analyzeKnowledge();
