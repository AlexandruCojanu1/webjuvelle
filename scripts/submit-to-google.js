/**
 * Script to submit blog posts to Google Indexing API
 * 
 * This script can be run manually or as part of a CI/CD pipeline
 * to automatically submit new blog posts to Google for indexing.
 * 
 * Usage:
 * node scripts/submit-to-google.js [--url=https://adsnow.ro] [--post-slug=article-slug]
 * 
 * Environment variables required:
 * - GOOGLE_CLIENT_EMAIL: Service account email
 * - GOOGLE_PRIVATE_KEY: Service account private key
 * - SITE_URL: Your website URL (defaults to https://adsnow.ro)
 */

import { getSortedPostsData } from '../lib/blog.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const SITE_URL = process.env.SITE_URL || 'https://adsnow.ro';
const API_ENDPOINT = process.env.API_ENDPOINT || `${SITE_URL}/api/google-indexing`;

/**
 * Submit a single URL to Google Indexing API
 */
async function submitUrl(url) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to submit URL: ${error.error || response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error submitting ${url}:`, error.message);
    throw error;
  }
}

/**
 * Submit all published blog posts to Google
 */
async function submitAllPosts() {
  const posts = getSortedPostsData();
  console.log(`Found ${posts.length} published posts to submit...`);

  const results = [];
  
  for (const post of posts) {
    const url = `${SITE_URL}/blog/${post.slug}`;
    console.log(`Submitting: ${url}`);
    
    try {
      const result = await submitUrl(url);
      results.push({ url, success: true, result });
      console.log(`✓ Successfully submitted: ${url}`);
      
      // Wait 1 second between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({ url, success: false, error: error.message });
      console.error(`✗ Failed to submit: ${url} - ${error.message}`);
    }
  }

  return results;
}

/**
 * Submit a specific post by slug
 */
async function submitPostBySlug(slug) {
  const posts = getSortedPostsData();
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  console.log(`Submitting: ${url}`);
  
  return await submitUrl(url);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const urlArg = args.find(arg => arg.startsWith('--url='));
  const slugArg = args.find(arg => arg.startsWith('--post-slug='));
  
  const siteUrl = urlArg ? urlArg.split('=')[1] : SITE_URL;
  const postSlug = slugArg ? slugArg.split('=')[1] : null;

  console.log(`Site URL: ${siteUrl}`);
  console.log(`API Endpoint: ${API_ENDPOINT}`);

  try {
    if (postSlug) {
      // Submit specific post
      const result = await submitPostBySlug(postSlug);
      console.log('\n✓ Successfully submitted post:', result);
    } else {
      // Submit all posts
      const results = await submitAllPosts();
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log('\n=== Submission Summary ===');
      console.log(`Total: ${results.length}`);
      console.log(`Successful: ${successful}`);
      console.log(`Failed: ${failed}`);
      
      if (failed > 0) {
        console.log('\nFailed URLs:');
        results.filter(r => !r.success).forEach(r => {
          console.log(`  - ${r.url}: ${r.error}`);
        });
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { submitUrl, submitAllPosts, submitPostBySlug };
