/**
 * Optimize all images in public/assets/images to WebP format
 * Automatically converts JPG/PNG to WebP and optimizes sizes
 * 
 * Usage:
 * node scripts/optimize-all-images.js
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesDir = join(__dirname, '..', 'public', 'assets', 'images');

// Images that should be optimized (large images)
const priorityImages = [
  'dummy-img-1920x900.jpg',
  'dummy-img-1920x900-2.jpg',
  'dummy-img-1920x300.jpg',
  'dummy-img-900x500.jpg',
  'dummy-img-900x600.jpg',
  'dummy-img-900x700.jpg',
  'dummy-img-900x900.png',
  'pexels-ionelceban-3194327.jpg',
  'pexels-solodsha-8105066.jpg',
  'Gemini_Generated_Image_kzt06fkzt06fkzt0.png',
];

// Max dimensions for optimization (mobile-first)
const maxDimensions = {
  'dummy-img-1920x900.jpg': { width: 1920, height: 1080 },
  'dummy-img-1920x900-2.jpg': { width: 1920, height: 1080 },
  'dummy-img-1920x300.jpg': { width: 1920, height: 300 },
  'dummy-img-900x500.jpg': { width: 900, height: 500 },
  'dummy-img-900x600.jpg': { width: 900, height: 600 },
  'dummy-img-900x700.jpg': { width: 900, height: 700 },
  'dummy-img-900x900.png': { width: 900, height: 900 },
  'pexels-ionelceban-3194327.jpg': { width: 1200, height: 800 },
  'pexels-solodsha-8105066.jpg': { width: 1200, height: 800 },
  'Gemini_Generated_Image_kzt06fkzt06fkzt0.png': { width: 800, height: 1000 },
};

async function optimizeImage(inputPath, outputPath, maxWidth = null, maxHeight = null) {
  try {
    const ext = extname(inputPath).toLowerCase();
    
    // Skip if already WebP
    if (ext === '.webp' || ext === '.svg') {
      return { success: false, skipped: true, reason: 'Already optimized format' };
    }
    
    // Check if WebP version already exists
    if (await existsSync(outputPath)) {
      const inputStats = await stat(inputPath);
      const outputStats = await stat(outputPath);
      
      // If WebP is newer or similar size, skip
      if (outputStats.mtime >= inputStats.mtime || outputStats.size < inputStats.size * 1.1) {
        return { success: false, skipped: true, reason: 'WebP version already exists and is up to date' };
      }
    }
    
    console.log(`Optimizing: ${basename(inputPath)} -> ${basename(outputPath)}`);
    
    let sharpInstance = sharp(inputPath);
    
    // Resize if max dimensions provided
    if (maxWidth || maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to WebP with optimization
    if (ext === '.jpg' || ext === '.jpeg') {
      sharpInstance = sharpInstance.webp({ 
        quality: 85,
        effort: 6,
        smartSubsample: true
      });
    } else if (ext === '.png') {
      sharpInstance = sharpInstance.webp({ 
        quality: 85,
        effort: 6,
        lossless: false
      });
    } else {
      return { success: false, skipped: true, reason: 'Unsupported format' };
    }
    
    await sharpInstance.toFile(outputPath);
    
    // Get file sizes
    const inputStats = await stat(inputPath);
    const outputStats = await stat(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`✓ Optimized: ${basename(inputPath)}`);
    console.log(`  Original: ${(inputStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  WebP: ${(outputStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Reduction: ${reduction}%`);
    console.log('');
    
    return {
      success: true,
      input: basename(inputPath),
      output: basename(outputPath),
      originalSize: inputStats.size,
      webpSize: outputStats.size,
      reduction: parseFloat(reduction)
    };
  } catch (error) {
    console.error(`✗ Error optimizing ${basename(inputPath)}:`, error.message);
    return {
      success: false,
      input: basename(inputPath),
      error: error.message
    };
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  const results = [];
  
  // Optimize priority images first
  for (const imageName of priorityImages) {
    const inputPath = join(imagesDir, imageName);
    
    // Check if file exists
    if (!(await existsSync(inputPath))) {
      console.log(`⚠ Skipping ${imageName} - file not found`);
      continue;
    }
    
    const ext = extname(imageName);
    const outputPath = join(imagesDir, imageName.replace(ext, '.webp'));
    const dimensions = maxDimensions[imageName];
    
    const result = await optimizeImage(
      inputPath, 
      outputPath,
      dimensions?.width,
      dimensions?.height
    );
    
    results.push(result);
  }
  
  // Also optimize other JPG/PNG images in the directory
  console.log('\n📁 Checking for other images to optimize...\n');
  
  try {
    const allFiles = await readdir(imagesDir);
    const otherImages = allFiles.filter(file => {
      const ext = extname(file).toLowerCase();
      return (ext === '.jpg' || ext === '.jpeg' || ext === '.png') && 
             !priorityImages.includes(file) &&
             !file.includes('logo') && // Skip logos (they're usually small)
             !file.includes('icon'); // Skip icons
    });
    
    for (const imageName of otherImages) {
      const inputPath = join(imagesDir, imageName);
      const ext = extname(imageName);
      const outputPath = join(imagesDir, imageName.replace(ext, '.webp'));
      
      const result = await optimizeImage(inputPath, outputPath);
      if (!result.skipped) {
        results.push(result);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Optimization Summary');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success && !r.skipped);
  const skipped = results.filter(r => r.skipped);
  
  console.log(`Total processed: ${results.length}`);
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`⏭️  Skipped: ${skipped.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
    const totalWebP = successful.reduce((sum, r) => sum + r.webpSize, 0);
    const avgReduction = ((1 - totalWebP / totalOriginal) * 100).toFixed(1);
    const totalSaved = totalOriginal - totalWebP;
    
    console.log(`\n💾 Size Reduction:`);
    console.log(`   Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   WebP total: ${(totalWebP / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Average reduction: ${avgReduction}%`);
    console.log(`   Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed optimizations:');
    failed.forEach(f => {
      console.log(`   - ${f.input}: ${f.error}`);
    });
  }
  
  console.log('\n✨ Optimization complete!\n');
}

main().catch(console.error);
