#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the remove-node-id.js script
const filePath = path.join(__dirname, '../src/identity/node-id/remove-node-id.js');

// Help Option
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
??  Netrum Node ID Remover
Usage:
  remove-node-id              Delete your existing Netrum Node ID
  remove-node-id --help       Show this help message

Description:
  This command deletes your Node ID configuration for the Netrum Lite Node.

??️  When should you remove your Node ID?

  ➤  If you're restarting your node from scratch
  ➤  If you're switching to a different base domain
  ➤  Or just want to regenerate a fresh node ID

??  After removal, you can re-run:
      netrum-node-id
`);
  process.exit(0);
}

// Run the remove-node-id.js script
spawn('node', [filePath], { stdio: 'inherit' });
