#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const miningPath = path.join(__dirname, '../src/system/mining/live-log.js');

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
⛏️  Netrum Mining Log Viewer
Usage:
  netrum-mining-log        View live mining logs
  netrum-mining-log --help Show this help
`);
  process.exit(0);
}

const miningProcess = spawn('node', [miningPath], {
  stdio: 'inherit'
});

miningProcess.on('error', (err) => {
  console.error('Error starting process:', err.message);
  process.exit(1);
});

miningProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Mining process exited with code ${code}`);
  }
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  miningProcess.kill('SIGINT');
});
