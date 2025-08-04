#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Image Optimization Script for SEO
 * 
 * This script analyzes images and provides optimization recommendations:
 * - Identifies oversized images
 * - Suggests modern format alternatives (WebP, AVIF)
 * - Provides image sizing recommendations
 * - Creates optimization tasks for better web performance
 */

const STATIC_DIR = path.join(__dirname, '..', 'static');
const BLOG_DIR = path.join(__dirname, '..', 'blog');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
const MODERN_FORMATS = ['.webp', '.avif'];

// Recommended image sizes for different use cases
const RECOMMENDED_SIZES = {
  hero: { width: 1200, height: 630 }, // For hero images and social sharing
  featured: { width: 800, height: 400 }, // For featured blog images
  thumbnail: { width: 300, height: 200 }, // For thumbnails
  icon: { width: 64, height: 64 }, // For icons
  logo: { width: 200, height: 200 } // For logos
};

function getImageInfo(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath, ext);
    const dir = path.dirname(filePath);
    
    // Extract dimensions from filename if available (e.g., image-800x600.jpg)
    const dimensionMatch = basename.match(/(\d+)x(\d+)/);
    const dimensions = dimensionMatch ? {
      width: parseInt(dimensionMatch[1]),
      height: parseInt(dimensionMatch[2])
    } : null;
    
    return {
      filePath,
      basename,
      ext,
      dir,
      size: stats.size,
      sizeKB: Math.round(stats.size / 1024),
      dimensions,
      isModernFormat: MODERN_FORMATS.includes(ext),
      isImageFile: IMAGE_EXTENSIONS.includes(ext) || MODERN_FORMATS.includes(ext)
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

function analyzeImageOptimization(imageInfo) {
  const issues = [];
  const suggestions = [];
  
  // Check file size
  if (imageInfo.sizeKB > 500) {
    issues.push({
      type: 'large_file',
      severity: 'high',
      message: `Large file size (${imageInfo.sizeKB}KB). Consider compression or modern formats.`
    });
  } else if (imageInfo.sizeKB > 200) {
    issues.push({
      type: 'medium_file',
      severity: 'medium',
      message: `Medium file size (${imageInfo.sizeKB}KB). Could benefit from optimization.`
    });
  }
  
  // Check for modern format availability
  if (!imageInfo.isModernFormat && IMAGE_EXTENSIONS.includes(imageInfo.ext)) {
    suggestions.push({
      type: 'modern_format',
      message: `Convert to WebP or AVIF for better compression and performance.`,
      webpPath: path.join(imageInfo.dir, imageInfo.basename + '.webp'),
      avifPath: path.join(imageInfo.dir, imageInfo.basename + '.avif')
    });
  }
  
  // Check dimensions if available
  if (imageInfo.dimensions) {
    const { width, height } = imageInfo.dimensions;
    
    if (width > 2000 || height > 2000) {
      issues.push({
        type: 'oversized',
        severity: 'high',
        message: `Very large dimensions (${width}x${height}). Consider resizing for web use.`
      });
    }
    
    // Suggest appropriate sizes based on filename patterns
    const filename = imageInfo.basename.toLowerCase();
    if (filename.includes('hero') || filename.includes('banner')) {
      if (width !== RECOMMENDED_SIZES.hero.width) {
        suggestions.push({
          type: 'resize',
          message: `Hero image should be ${RECOMMENDED_SIZES.hero.width}x${RECOMMENDED_SIZES.hero.height}px for optimal social sharing.`
        });
      }
    } else if (filename.includes('thumb')) {
      if (width > RECOMMENDED_SIZES.thumbnail.width) {
        suggestions.push({
          type: 'resize',
          message: `Thumbnail should be ${RECOMMENDED_SIZES.thumbnail.width}x${RECOMMENDED_SIZES.thumbnail.height}px or smaller.`
        });
      }
    }
  }
  
  return { issues, suggestions };
}

function getAllImages(dir) {
  const images = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else {
          const ext = path.extname(item).toLowerCase();
          if (IMAGE_EXTENSIONS.includes(ext) || MODERN_FORMATS.includes(ext)) {
            images.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentDir}:`, error.message);
    }
  }
  
  traverse(dir);
  return images;
}

function generateOptimizationCommands(imageInfo, analysis) {
  const commands = [];
  
  if (analysis.suggestions.find(s => s.type === 'modern_format')) {
    // Generate WebP conversion command (requires cwebp tool)
    const webpOutput = path.join(imageInfo.dir, imageInfo.basename + '.webp');
    commands.push({
      tool: 'cwebp',
      command: `cwebp -q 80 "${imageInfo.filePath}" -o "${webpOutput}"`,
      description: 'Convert to WebP format'
    });
    
    // Generate AVIF conversion command (requires avifenc tool)
    const avifOutput = path.join(imageInfo.dir, imageInfo.basename + '.avif');
    commands.push({
      tool: 'avifenc',
      command: `avifenc --min 0 --max 63 -a end-usage=q -a cq-level=32 -a tune=ssim "${imageInfo.filePath}" "${avifOutput}"`,
      description: 'Convert to AVIF format'
    });
  }
  
  if (analysis.issues.find(i => i.type === 'large_file' || i.type === 'oversized')) {
    // Generate compression command (requires imagemagick)
    commands.push({
      tool: 'magick',
      command: `magick "${imageInfo.filePath}" -quality 85 -strip "${imageInfo.filePath}"`,
      description: 'Compress and strip metadata'
    });
  }
  
  return commands;
}

function main() {
  console.log('🖼️  Analyzing images for SEO optimization...\n');
  
  const directories = [STATIC_DIR];
  if (fs.existsSync(BLOG_DIR)) {
    directories.push(BLOG_DIR);
  }
  
  let totalImages = 0;
  let totalIssues = 0;
  let totalSuggestions = 0;
  let totalSizeKB = 0;
  
  const optimizationCommands = [];
  
  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      continue;
    }
    
    console.log(`📂 Scanning ${path.relative(process.cwd(), dir)}/`);
    
    const images = getAllImages(dir);
    console.log(`   Found ${images.length} images\n`);
    
    for (const imagePath of images) {
      const imageInfo = getImageInfo(imagePath);
      if (!imageInfo) continue;
      
      const analysis = analyzeImageOptimization(imageInfo);
      const relativePath = path.relative(process.cwd(), imagePath);
      
      totalImages++;
      totalSizeKB += imageInfo.sizeKB;
      
      if (analysis.issues.length > 0 || analysis.suggestions.length > 0) {
        console.log(`📸 ${relativePath}`);
        console.log(`   Size: ${imageInfo.sizeKB}KB${imageInfo.dimensions ? ` | Dimensions: ${imageInfo.dimensions.width}x${imageInfo.dimensions.height}` : ''}`);
        
        for (const issue of analysis.issues) {
          console.log(`   ❌ ${issue.message}`);
          totalIssues++;
        }
        
        for (const suggestion of analysis.suggestions) {
          console.log(`   💡 ${suggestion.message}`);
          totalSuggestions++;
        }
        
        const commands = generateOptimizationCommands(imageInfo, analysis);
        if (commands.length > 0) {
          optimizationCommands.push({ imageInfo, commands, relativePath });
        }
        
        console.log('');
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total images analyzed: ${totalImages}`);
  console.log(`   Total size: ${Math.round(totalSizeKB / 1024)}MB`);
  console.log(`   Issues found: ${totalIssues}`);
  console.log(`   Optimization suggestions: ${totalSuggestions}`);
  
  if (optimizationCommands.length > 0) {
    console.log(`\n🛠️  Optimization Commands:`);
    console.log(`   To optimize images, install the required tools and run these commands:\n`);
    
    console.log(`   # Install tools (Ubuntu/Debian):`);
    console.log(`   sudo apt-get install webp imagemagick`);
    console.log(`   # For AVIF: download avifenc from https://github.com/AOMediaCodec/libavif\n`);
    
    for (const { relativePath, commands } of optimizationCommands.slice(0, 10)) {
      console.log(`   # ${relativePath}`);
      for (const cmd of commands) {
        console.log(`   ${cmd.command}`);
      }
      console.log('');
    }
    
    if (optimizationCommands.length > 10) {
      console.log(`   ... and ${optimizationCommands.length - 10} more files\n`);
    }
    
    // Generate batch script
    const batchScript = optimizationCommands.map(({ commands }) => 
      commands.map(cmd => cmd.command).join('\n')
    ).join('\n');
    
    fs.writeFileSync('optimize-images.sh', `#!/bin/bash\n\n# Image optimization batch script\n# Generated by image-optimizer.js\n\n${batchScript}\n`);
    console.log(`   📝 Batch script saved to: optimize-images.sh`);
  }
  
  console.log(`\n💡 Tips for better image SEO:`);
  console.log(`   • Use descriptive filenames (e.g., "azure-architecture-diagram.png")`);
  console.log(`   • Always include meaningful alt text`);
  console.log(`   • Prefer WebP/AVIF formats for better compression`);
  console.log(`   • Optimize images for their intended display size`);
  console.log(`   • Consider lazy loading for non-critical images`);
}

if (require.main === module) {
  main();
}

module.exports = {
  getImageInfo,
  analyzeImageOptimization,
  getAllImages
};