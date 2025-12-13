import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const CSV_FILE = process.argv[2] || path.resolve(__dirname, '../test-bulk-upload.csv'); // CSV file path as argument or default
const IMAGES_DIR = path.resolve(__dirname, '../product-images');

async function downloadImage(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.log(`Redirecting to: ${redirectUrl}`);
          downloadImage(redirectUrl, filename).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(path.join(IMAGES_DIR, filename));
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(path.join(IMAGES_DIR, filename), () => {});
        reject(err);
      });
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function downloadImagesFromCSV() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const imageIndex = headers.indexOf('image');
  if (imageIndex === -1) {
    console.error('No "image" column found in CSV');
    return;
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const imageUrl = values[imageIndex]?.trim();
    if (!imageUrl) continue;

    // Convert Dropbox URL to direct download
    let downloadUrl = imageUrl;
    if (imageUrl.includes('dropbox.com')) {
      downloadUrl = imageUrl.replace('dl=0', 'dl=1') + (imageUrl.includes('raw=1') ? '' : '&raw=1');
    }

    // Generate filename from URL
    const urlParts = downloadUrl.split('/');
    const urlFilename = urlParts[urlParts.length - 1].split('?')[0];
    let filename = urlFilename;
    if (!filename.includes('.')) {
      filename += '.jpg'; // Default extension
    }

    try {
      await downloadImage(downloadUrl, filename);
    } catch (error) {
      console.error(`❌ Failed to download ${downloadUrl}:`, error.message);
    }
  }

  console.log('All downloads attempted!');
}

downloadImagesFromCSV().catch(console.error);