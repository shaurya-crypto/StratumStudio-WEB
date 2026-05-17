const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'public/boards')
];

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file.endsWith('.png')) {
      const inputPath = path.join(dir, file);
      // Let's not convert og-image.png or screenshot.png as they might need to be png for SEO/Twitter
      if (file === 'og-image.png' || file === 'screenshot.png') continue;

      const outputPath = path.join(dir, file.replace('.png', '.webp'));
      
      try {
        await sharp(inputPath)
          .webp({ quality: 75, effort: 6 })
          .toFile(outputPath);
        console.log(`Converted: ${inputPath} -> ${outputPath}`);
      } catch (err) {
        console.error(`Error converting ${inputPath}:`, err);
      }
    }
  }
}

async function run() {
  for (const dir of targetDirs) {
    await processDirectory(dir);
  }
  console.log('Conversion complete!');
}

run();
