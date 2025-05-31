import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const leafletAssets = [
  'marker-icon.png',
  'marker-icon-2x.png',
  'marker-shadow.png'
];

const sourceDir = path.join(__dirname, '../node_modules/leaflet/dist/images');
const targetDir = path.join(__dirname, '../public');

// Create public directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

// Copy each asset
leafletAssets.forEach(asset => {
  const sourcePath = path.join(sourceDir, asset);
  const targetPath = path.join(targetDir, asset);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Copied ${asset} to public directory`);
}); 