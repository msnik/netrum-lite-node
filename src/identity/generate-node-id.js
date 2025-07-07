#!/usr/bin/env node
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure data folder exists
const dataDir = path.join(__dirname, '../../data');
const nodeDir = path.join(dataDir, 'node');
const idFile = path.join(nodeDir, 'id.txt');

try {
  fs.mkdirSync(nodeDir, { recursive: true });

  // Check if Node ID already exists
  let NODE_ID;
  if (!fs.existsSync(idFile)) {
    // Generate random hex string
    NODE_ID = `netrumlite_${crypto.randomBytes(16).toString('hex')}`;
    fs.writeFileSync(idFile, NODE_ID);
    console.log(`?? New Node ID generated: ${NODE_ID}`);
  } else {
    NODE_ID = fs.readFileSync(idFile, 'utf-8').trim();
    console.log(`?? Existing Node ID: ${NODE_ID}`);
  }
} catch (error) {
  console.error('❌ Error generating Node ID:', error);
  process.exit(1);
}
