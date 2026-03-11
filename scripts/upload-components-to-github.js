import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Removed Octokit import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace these with local process.env fallback if running locally
const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_COMPONENT_LIBRARY_OWNER || 'AlexandruCojanu1';
const repo = process.env.GITHUB_COMPONENT_LIBRARY_REPO || 'component-library-astro'; // Note: Adjust default if different

if (!token) {
    console.error('ERROR: GITHUB_TOKEN environment variable is required.');
    process.exit(1);
}

const templatesPath = path.join(__dirname, '..', 'gsap-templates.json');

async function uploadComponents() {
    if (!fs.existsSync(templatesPath)) {
        console.error(`Templates file not found at ${templatesPath}`);
        return;
    }

    const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));
    console.log(`Found ${templates.length} templates. Starting upload to ${owner}/${repo}...`);

    for (const template of templates) {
        const filePath = `src/components/gsap/${template.name}`;
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        
        try {
            // Check if file exists to get its SHA for overwriting
            let fileSha;
            try {
                const getRes = await fetch(url, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'Webjuvelle-AI-Agent'
                    }
                });
                
                if (getRes.ok) {
                   const data = await getRes.json();
                   fileSha = data.sha;
                }
            } catch (e) {
                // File does not exist yet, which is fine
            }

            // Create or update file
            const putRes = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Webjuvelle-AI-Agent'
                },
                body: JSON.stringify({
                    message: `feat(gsap): add ${template.name}`,
                    content: Buffer.from(template.content).toString('base64'),
                    sha: fileSha
                })
            });
            
            if (putRes.ok) {
                console.log(`✅ Uploaded: ${filePath}`);
            } else {
                const errData = await putRes.json();
                console.error(`❌ Failed to upload ${filePath}:`, errData.message);
            }
        } catch (error) {
            console.error(`❌ Exception uploading ${filePath}:`, error.message);
        }
    }
    
    console.log('Upload process completed.');
}

uploadComponents();
