/**
 * Convert images to WebP format for better performance
 * 
 * Usage:
 * node scripts/convert-to-webp.js
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Images to convert
const imagesToConvert = [
  {
    input: '/Users/alexandrucojanu/Downloads/marko_main_files/pexels-ionelceban-3194327.jpg',
    output: join(__dirname, '..', 'public', 'assets', 'images', 'pexels-ionelceban-3194327.webp')
  },
  {
    input: '/Users/alexandrucojanu/Downloads/marko_main_files/Gemini_Generated_Image_kzt06fkzt06fkzt0.png',
    output: join(__dirname, '..', 'public', 'assets', 'images', 'Gemini_Generated_Image_kzt06fkzt06fkzt0.webp')
  },
  {
    input: '/Users/alexandrucojanu/Downloads/marko_main_files/cursor.png',
    output: join(__dirname, '..', 'public', 'assets', 'images', 'cursor.webp')
  },
  {
    input: '/Users/alexandrucojanu/Downloads/marko_main_files/favicon.jpeg',
    output: join(__dirname, '..', 'public', 'favicon.webp')
  }
];

async function convertToWebP(inputPath, outputPath) {
  try {
    console.log(`Converting: ${inputPath} -> ${outputPath}`);
    
    // Optimize based on file type
    const ext = extname(inputPath).toLowerCase();
    let sharpInstance = sharp(inputPath);
    
    if (ext === '.jpg' || ext === '.jpeg') {
      // For JPEG, try lower quality if original is already optimized
      sharpInstance = sharpInstance.webp({ 
        quality: 80,
        effort: 6 
      });
    } else {
      // For PNG and other formats
      sharpInstance = sharpInstance.webp({ 
        quality: 85,
        effort: 6 
      });
    }
    
    await sharpInstance.toFile(outputPath);
    
    // Get file sizes
    const inputStats = await stat(inputPath);
    const outputStats = await stat(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`✓ Converted: ${basename(inputPath)}`);
    console.log(`  Original: ${(inputStats.size / 1024).toFixed(2)} KB`);
    console.log(`  WebP: ${(outputStats.size / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${reduction}%`);
    console.log('');
    
    return {
      success: true,
      input: inputPath,
      output: outputPath,
      originalSize: inputStats.size,
      webpSize: outputStats.size,
      reduction: parseFloat(reduction)
    };
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
    return {
      success: false,
      input: inputPath,
      error: error.message
    };
  }
}

async function main() {
  console.log('Starting WebP conversion...\n');
  
  const results = [];
  
  for (const image of imagesToConvert) {
    const result = await convertToWebP(image.input, image.output);
    results.push(result);
  }
  
  console.log('\n=== Conversion Summary ===');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`Total: ${results.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
    const totalWebP = successful.reduce((sum, r) => sum + r.webpSize, 0);
    const avgReduction = ((1 - totalWebP / totalOriginal) * 100).toFixed(1);
    
    console.log(`\nTotal size reduction: ${avgReduction}%`);
    console.log(`Original total: ${(totalOriginal / 1024).toFixed(2)} KB`);
    console.log(`WebP total: ${(totalWebP / 1024).toFixed(2)} KB`);
  }
  
  if (failed.length > 0) {
    console.log('\nFailed conversions:');
    failed.forEach(f => {
      console.log(`  - ${f.input}: ${f.error}`);
    });
  }
}

main().catch(console.error);
