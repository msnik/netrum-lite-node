#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Paths ===
const localIdPath = path.join(__dirname, 'id.txt');
const globalIdPath = path.join(__dirname, '../../../data/node-id/id.txt');

// === Remove Function ===
function removeFile(filePath, label) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`??️  Deleted ${label} Node ID: ${filePath}`);
    } else {
      console.log(`⚠️  ${label} Node ID not found at: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌  Failed to delete ${label} Node ID:`, error.message);
  }
}

// === Start Removal ===
console.log('?? Removing Netrum Node ID files...');
removeFile(localIdPath, 'Local');
removeFile(globalIdPath, 'Global');

console.log('\n✅  Node ID cleanup complete.');
