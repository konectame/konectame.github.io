import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, '../public/Icon_color_pos_03.png');
const outputFile = path.join(__dirname, '../public/favicon.ico');

// Create a circular SVG mask
function createCircularMask(size) {
    return Buffer.from(`
        <svg width="${size}" height="${size}">
            <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
        </svg>
    `);
}

// Create multiple sizes for the favicon (16x16, 32x32, 48x48)
async function generateFavicon() {
    try {
        // Create an array of promises for different icon sizes
        const sizes = [16, 32, 48];
        const buffers = await Promise.all(
            sizes.map(async size => {
                // Create circular mask for this size
                const mask = createCircularMask(size);
                
                // Process the image
                const processedBuffer = await sharp(inputFile)
                    .resize(size, size, {
                        fit: 'contain',
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    })
                    // Ensure image has alpha channel
                    .ensureAlpha()
                    // Apply the circular mask
                    .composite([{
                        input: mask,
                        blend: 'dest-in'
                    }])
                    .toFormat('png')
                    .toBuffer();

                return processedBuffer;
            })
        );

        // Combine all buffers into a single ICO file
        const icoBuffer = Buffer.concat([
            // ICO header
            Buffer.from([
                0, 0,             // Reserved
                1, 0,             // ICO type
                sizes.length, 0,  // Number of images
            ]),
            // ICO directory
            ...sizes.map((size, index) => {
                const offset = sizes.reduce((acc, _, i) => 
                    i < index ? acc + buffers[i].length : acc, 
                    6 + (sizes.length * 16) // Header size + (number of images * directory entry size)
                );
                return Buffer.from([
                    size,        // Width
                    size,        // Height
                    0,           // Color palette
                    0,           // Reserved
                    1, 0,        // Color planes
                    32, 0,       // Bits per pixel
                    ...Buffer.from(new Uint32Array([buffers[index].length]).buffer), // Size
                    ...Buffer.from(new Uint32Array([offset]).buffer),                // Offset
                ]);
            }),
            // Image data
            ...buffers
        ]);

        // Write the ICO file
        fs.writeFileSync(outputFile, icoBuffer);
        console.log('Favicon generated successfully!');
    } catch (error) {
        console.error('Error generating favicon:', error);
    }
}

generateFavicon();
