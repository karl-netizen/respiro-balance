/**
 * Generate PWA Icons Script
 * Converts logo.svg to all required PNG icon sizes
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes required for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Paths
const SOURCE_SVG = path.join(__dirname, '..', 'public', 'logo.svg');
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

async function generateIcons() {
  console.log('🎨 Generating PWA icons from logo.svg...\n');

  // Check if source SVG exists
  if (!fs.existsSync(SOURCE_SVG)) {
    console.error('❌ Error: logo.svg not found at', SOURCE_SVG);
    process.exit(1);
  }

  // Generate each icon size
  for (const size of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

    try {
      await sharp(SOURCE_SVG)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 59, g: 130, b: 246, alpha: 1 } // #3b82f6
        })
        .png({
          quality: 100,
          compressionLevel: 9
        })
        .toFile(outputPath);

      console.log(`✅ Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Failed to generate icon-${size}x${size}.png:`, error.message);
    }
  }

  // Also generate apple-touch-icon.png (180x180)
  const appleTouchIcon = path.join(OUTPUT_DIR, 'apple-touch-icon.png');
  try {
    await sharp(SOURCE_SVG)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 59, g: 130, b: 246, alpha: 1 }
      })
      .png({
        quality: 100,
        compressionLevel: 9
      })
      .toFile(appleTouchIcon);

    console.log(`✅ Generated: apple-touch-icon.png (180x180)`);
  } catch (error) {
    console.error('❌ Failed to generate apple-touch-icon.png:', error.message);
  }

  // Generate favicon-16x16.png and favicon-32x32.png
  for (const size of [16, 32]) {
    const faviconPath = path.join(OUTPUT_DIR, `favicon-${size}x${size}.png`);

    try {
      await sharp(SOURCE_SVG)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 59, g: 130, b: 246, alpha: 1 }
        })
        .png({
          quality: 100,
          compressionLevel: 9
        })
        .toFile(faviconPath);

      console.log(`✅ Generated: favicon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Failed to generate favicon-${size}x${size}.png:`, error.message);
    }
  }

  console.log('\n✨ Icon generation complete!');
  console.log('\n📁 Generated files:');
  console.log('   - icon-72x72.png through icon-512x512.png (8 files)');
  console.log('   - apple-touch-icon.png');
  console.log('   - favicon-16x16.png, favicon-32x32.png');
  console.log('\n✅ Total: 11 icon files generated');
  console.log('\n🚀 Your PWA is now ready for mobile installation!');
}

// Run the generation
generateIcons().catch(error => {
  console.error('\n❌ Icon generation failed:', error);
  process.exit(1);
});
