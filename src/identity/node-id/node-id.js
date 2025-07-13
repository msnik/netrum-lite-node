#!/usr/bin/env node
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Path to basename.txt ===
const basenamePath = path.join(__dirname, 'basename.txt');

// === Check for basename.txt ===
if (!fs.existsSync(basenamePath)) {
  console.log('❌  Base domain not found.');
  console.log('??  Please verify your wallet’s base domain by running:');
  console.log('    netrum-check-basename\n');
  process.exit(1);
}

// === Read base domain ===
const basename = fs.readFileSync(basenamePath, 'utf8').trim();
if (!basename) {
  console.error('❌  basename.txt is empty or invalid.');
  process.exit(1);
}

// === Construct Node ID ===
const NODE_ID = `netrum.lite.${basename}`;
console.log(`✅  Generated Node ID: ${NODE_ID}`);

// === Save to id.txt in current folder ===
const localIdPath = path.join(__dirname, 'id.txt');
fs.writeFileSync(localIdPath, NODE_ID);
console.log(`??  Saved locally: ${localIdPath}`);

// === Save to ../../../data/node-id/id.txt ===
const globalIdPath = path.join(__dirname, '../../../data/node-id/id.txt');
fs.mkdirSync(path.dirname(globalIdPath), { recursive: true });
fs.writeFileSync(globalIdPath, NODE_ID);
console.log(`??  Also saved to global path: ${globalIdPath}`);
