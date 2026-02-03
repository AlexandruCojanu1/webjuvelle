/**
 * Video Optimization Script
 * 
 * This script checks video files and provides optimization instructions.
 * For actual video conversion, you'll need FFmpeg installed.
 * 
 * Usage:
 * node scripts/optimize-videos.js
 * 
 * Then run the generated FFmpeg commands manually or install ffmpeg-node
 */

import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const videosDir = join(__dirname, '..', 'public', 'assets', 'videos');

// Check if FFmpeg is available
function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function getVideoInfo(videoPath) {
  try {
    const stats = await stat(videoPath);
    return {
      size: stats.size,
      exists: true
    };
  } catch {
    return { exists: false };
  }
}

async function optimizeVideoWithFFmpeg(inputPath, outputPath, format) {
  try {
    const inputInfo = await getVideoInfo(inputPath);
    if (!inputInfo.exists) {
      return { success: false, error: 'Input file not found' };
    }
    
    console.log(`\n🎬 Optimizing: ${basename(inputPath)} -> ${basename(outputPath)}`);
    console.log(`   Original size: ${(inputInfo.size / 1024 / 1024).toFixed(2)} MB`);
    
    let command;
    
    if (format === 'webm') {
      // WebM with VP9 codec - best compression
      command = `ffmpeg -i "${inputPath}" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k -y "${outputPath}"`;
    } else if (format === 'mp4') {
      // MP4 with H.264 - good compatibility
      command = `ffmpeg -i "${inputPath}" -c:v libx264 -preset slow -crf 22 -maxrate 2M -bufsize 4M -c:a aac -b:a 128k -movflags +faststart -y "${outputPath}"`;
    } else if (format === 'poster') {
      // Generate poster image
      command = `ffmpeg -i "${inputPath}" -ss 00:00:01 -vframes 1 -vf "scale=1920:-1" -y "${outputPath}"`;
    }
    
    execSync(command, { stdio: 'inherit' });
    
    const outputInfo = await getVideoInfo(outputPath);
    if (outputInfo.exists) {
      const reduction = ((1 - outputInfo.size / inputInfo.size) * 100).toFixed(1);
      console.log(`   ✅ Optimized size: ${(outputInfo.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   📉 Reduction: ${reduction}%`);
      
      return {
        success: true,
        originalSize: inputInfo.size,
        optimizedSize: outputInfo.size,
        reduction: parseFloat(reduction)
      };
    }
    
    return { success: false, error: 'Output file not created' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function generatePosterImage(videoPath, outputPath) {
  try {
    const inputInfo = await getVideoInfo(videoPath);
    if (!inputInfo.exists) {
      return { success: false, error: 'Video file not found' };
    }
    
    console.log(`\n🖼️  Generating poster: ${basename(outputPath)}`);
    
    // Extract frame at 1 second
    const command = `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -vf "scale=1920:-1" -y "${outputPath}"`;
    execSync(command, { stdio: 'inherit' });
    
    const outputInfo = await getVideoInfo(outputPath);
    if (outputInfo.exists) {
      console.log(`   ✅ Poster created: ${(outputInfo.size / 1024).toFixed(2)} KB`);
      return { success: true };
    }
    
    return { success: false, error: 'Poster not created' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🎬 Video Optimization Script\n');
  
  const hasFFmpeg = checkFFmpeg();
  
  if (!hasFFmpeg) {
    console.log('⚠️  FFmpeg not found!');
    console.log('\n📋 To optimize videos, please install FFmpeg:');
    console.log('   macOS: brew install ffmpeg');
    console.log('   Ubuntu: sudo apt-get install ffmpeg');
    console.log('   Windows: Download from https://ffmpeg.org/download.html\n');
    
    console.log('📝 Manual optimization commands:\n');
    
    const videos = [
      { name: 'Adsnow.mov', formats: ['webm', 'mp4'], poster: true },
      { name: 'Generare_Video_Scurt_cu_Elemente_Specifice.mp4', formats: ['webm'], poster: false }
    ];
    
    for (const video of videos) {
      const inputPath = join(videosDir, video.name);
      const baseName = basename(video.name, extname(video.name));
      
      console.log(`\n📹 ${video.name}:`);
      
      if (video.formats.includes('webm')) {
        const webmPath = join(videosDir, `${baseName}.webm`);
        console.log(`   WebM: ffmpeg -i "${inputPath}" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k "${webmPath}"`);
      }
      
      if (video.formats.includes('mp4')) {
        const mp4Path = join(videosDir, `${baseName}.mp4`);
        console.log(`   MP4:  ffmpeg -i "${inputPath}" -c:v libx264 -preset slow -crf 22 -maxrate 2M -bufsize 4M -c:a aac -b:a 128k -movflags +faststart "${mp4Path}"`);
      }
      
      if (video.poster) {
        const posterPath = join(__dirname, '..', 'public', 'assets', 'images', 'guide-banner-poster.webp');
        console.log(`   Poster: ffmpeg -i "${inputPath}" -ss 00:00:01 -vframes 1 -vf "scale=1920:-1" "${posterPath}"`);
      }
    }
    
    return;
  }
  
  console.log('✅ FFmpeg found! Starting optimization...\n');
  
  const results = [];
  
  // Optimize Adsnow.mov
  const adsnowMov = join(videosDir, 'Adsnow.mov');
  const adsnowMovInfo = await getVideoInfo(adsnowMov);
  
  if (adsnowMovInfo.exists) {
    // Check if optimized versions exist
    const adsnowWebm = join(videosDir, 'Adsnow.webm');
    const adsnowMp4 = join(videosDir, 'Adsnow.mp4');
    const posterPath = join(__dirname, '..', 'public', 'assets', 'images', 'guide-banner-poster.webp');
    
    const webmExists = await existsSync(adsnowWebm);
    const mp4Exists = await existsSync(adsnowMp4);
    const posterExists = await existsSync(posterPath);
    
    if (!webmExists || !mp4Exists) {
      if (!webmExists) {
        const result = await optimizeVideoWithFFmpeg(adsnowMov, adsnowWebm, 'webm');
        if (result.success) results.push({ ...result, format: 'WebM' });
      }
      
      if (!mp4Exists) {
        const result = await optimizeVideoWithFFmpeg(adsnowMov, adsnowMp4, 'mp4');
        if (result.success) results.push({ ...result, format: 'MP4' });
      }
    } else {
      console.log('✅ Adsnow.webm and Adsnow.mp4 already exist');
    }
    
    // Generate poster if doesn't exist
    if (!posterExists) {
      await generatePosterImage(adsnowMov, posterPath);
    } else {
      console.log('✅ Poster image already exists');
    }
  } else {
    console.log('⚠️  Adsnow.mov not found');
  }
  
  // Summary
  if (results.length > 0) {
    console.log('\n' + '='.repeat(50));
    console.log('📊 Video Optimization Summary');
    console.log('='.repeat(50));
    
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
    const avgReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
    const totalSaved = totalOriginal - totalOptimized;
    
    console.log(`\n💾 Total Size Reduction:`);
    console.log(`   Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Optimized: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Average reduction: ${avgReduction}%`);
    console.log(`   Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  }
  
  console.log('\n✨ Video optimization complete!\n');
}

main().catch(console.error);
