import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimizeImages() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const files = fs.readdirSync(imagesDir).filter((f) => f.endsWith('.jpg') || f.endsWith('.png'));

  console.log(`Optimizing ${files.length} estate imagery assets...`);

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const originalBuffer = fs.readFileSync(filePath);
    const originalSizeKb = Math.round(originalBuffer.length / 1024);

    const optimizedBuffer = await sharp(originalBuffer)
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({
        quality: 78,
        mozjpeg: true,
      })
      .toBuffer();

    const optimizedSizeKb = Math.round(optimizedBuffer.length / 1024);

    fs.writeFileSync(filePath, optimizedBuffer);
    console.log(`✓ ${file}: ${originalSizeKb} KB -> ${optimizedSizeKb} KB (< 300 KB constraint)`);
  }

  console.log('✨ All estate photography assets successfully optimized!');
}

optimizeImages().catch((err) => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
