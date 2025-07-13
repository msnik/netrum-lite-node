#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../src/system/sync/syncing.js');

// If user runs --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
??  Netrum Sync CLI
Usage:
  netrum-sync                Start syncing system with Netrum server
  netrum-sync --help         Show this help message

Description:
  Sync your local system with the Netrum server.

  - Requires at least 4 GB RAM, 2 CPU cores, and 50 GB disk space
  - Sends sync request to server every 5 seconds
  - Live sync logs update every 5 seconds
  - Helps determine if your node status is Active or Inactive
`);
  process.exit(0);
}

// Run syncing.js using node
spawn('node', [filePath], { stdio: 'inherit' });
