import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
    // Quality of JPEG compression (0-100)
    jpegQuality: 80,
    // Quality of PNG compression (0-100)
    pngQuality: 80,
    // Paths to search for images (relative to project root)
    sourcePaths: [
        '../src/**/*.{jpg,jpeg,png}',
        '../public/**/*.{jpg,jpeg,png}'
    ],
    // Output directory for compressed images (will maintain original directory structure)
    outputDir: 'compressed',
    // Maximum width for images (set to null to maintain original width)
    maxWidth: 1920,
    // Skip files smaller than this size (in bytes)
    minSize: 10 * 1024, // 10KB
};

async function compressImage(inputPath, outputPath, stats) {
    try {
        // Create output directory if it doesn't exist
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Skip small files
        const fileSize = fs.statSync(inputPath).size;
        if (fileSize < config.minSize) {
            console.log(`Skipping ${inputPath} (too small: ${(fileSize / 1024).toFixed(2)}KB)`);
            return;
        }

        // Initialize sharp with the input image
        let pipeline = sharp(inputPath);

        // Get image metadata
        const metadata = await pipeline.metadata();

        // Resize if needed
        if (config.maxWidth && metadata.width > config.maxWidth) {
            pipeline = pipeline.resize(config.maxWidth, null, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Apply compression based on image format
        const ext = path.extname(inputPath).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({ quality: config.jpegQuality });
        } else if (ext === '.png') {
            pipeline = pipeline.png({ quality: config.pngQuality });
        }

        // Process the image
        await pipeline.toFile(outputPath);

        // Get compressed file size
        const compressedSize = fs.statSync(outputPath).size;
        const savings = ((fileSize - compressedSize) / fileSize * 100).toFixed(2);

        // Update statistics
        stats.totalSaved += fileSize - compressedSize;
        stats.filesProcessed++;

        console.log(`Compressed ${inputPath}:`);
        console.log(`  Original size: ${(fileSize / 1024).toFixed(2)}KB`);
        console.log(`  Compressed size: ${(compressedSize / 1024).toFixed(2)}KB`);
        console.log(`  Savings: ${savings}%`);

    } catch (error) {
        console.error(`Error processing ${inputPath}:`, error);
        stats.errors++;
    }
}

async function main() {
    const stats = {
        filesProcessed: 0,
        totalSaved: 0,
        errors: 0
    };

    try {
        // Find all images
        const files = await glob(config.sourcePaths, {
            cwd: __dirname,
            absolute: true
        });

        if (files.length === 0) {
            console.log('No images found to compress.');
            return;
        }

        console.log(`Found ${files.length} images to process...`);

        // Process each image
        for (const file of files) {
            const relativePath = path.relative(path.resolve(__dirname, '..'), file);
            const outputPath = path.join(__dirname, config.outputDir, relativePath);
            await compressImage(file, outputPath, stats);
        }

        // Print final statistics
        console.log('\nCompression completed!');
        console.log(`Processed ${stats.filesProcessed} files`);
        console.log(`Total space saved: ${(stats.totalSaved / 1024 / 1024).toFixed(2)}MB`);
        if (stats.errors > 0) {
            console.log(`Errors encountered: ${stats.errors}`);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
