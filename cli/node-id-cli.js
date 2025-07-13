#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the actual node-id.js script
const filePath = path.join(__dirname, '../src/identity/node-id/node-id.js');

// Help Option
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
??  Netrum Node ID Generator
Usage:
  generate-node-id              Generate your unique Netrum Node ID
  generate-node-id --help       Show this help message

Description:
  This command generates a unique Node ID for your Netrum Lite Node.

⚠️  Make sure the following steps are completed before generating the Node ID:

  1️⃣  Your node wallet must be set.
      ➤  Check using: netrum-wallet

  2️⃣  Your node wallet must have a registered .base domain.
      ➤  Verify using: netrum-check-basename

✅  Once both conditions are met, a unique Node ID will be created and saved.

Format:
  netrum.lite.{your-base-domain}

Example:
  netrum.lite.testnetrumlabs.base.eth
`);
  process.exit(0);
}

// Execute the node-id.js script
spawn('node', [filePath], { stdio: 'inherit' });
