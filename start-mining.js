#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Setup current dir
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root path
const rootPath = path.resolve(__dirname); // you are already in /root/netrum-lite-node
const miningPath = path.join(rootPath, 'src', 'system', 'mining');

// 1. Run generate-mining-token.js from correct path
console.log('🔑 Generating mining token...');
execSync(`node ${path.join(miningPath, 'generate-mining-token.js')}`, { stdio: 'inherit' });

// 2. Copy systemd file
const templatePath = path.join(miningPath, 'mining.txt');
const systemdTarget = '/etc/systemd/system/netrum-mining.service';

if (!fs.existsSync(templatePath)) {
  console.error('❌ mining.txt file not found at:', templatePath);
  process.exit(1);
}

fs.copyFileSync(templatePath, '/tmp/netrum-mining.tmp');
execSync(`sudo mv /tmp/netrum-mining.tmp ${systemdTarget}`);
execSync(`sudo chmod 644 ${systemdTarget}`);

// 3. Logging setup
execSync('sudo mkdir -p /var/log/netrum-mining');
execSync('sudo touch /var/log/netrum-mining.log');
execSync('sudo touch /var/log/netrum-mining.error.log');
execSync('sudo chown root:root /var/log/netrum-mining.*');

// 4. Enable and start service
execSync('sudo systemctl daemon-reload');
execSync('sudo systemctl enable netrum-mining.service');
execSync('sudo systemctl restart netrum-mining.service');

// 5. Ensure nodeId file exists
const nodeIdPath = path.join(rootPath, 'data', 'node', 'id.txt');
if (!fs.existsSync(nodeIdPath)) {
  execSync(`mkdir -p ${path.dirname(nodeIdPath)}`);
  execSync(`uuidgen > ${nodeIdPath}`);
}

console.log('\n✅ Netrum Mining Node Service Installed and Running!');
console.log('\n🔍 Status:');
console.log('   sudo systemctl status netrum-mining.service');
console.log('\n📄 Logs:');
console.log('   sudo tail -f /var/log/netrum-mining.log');
