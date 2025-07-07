#!/usr/bin/env node
import fs from 'fs';
import { execSync } from 'child_process';

// 1. Read service template
const serviceTemplate = fs.readFileSync('/root/netrum-lite-node/src/system/sync/service.txt', 'utf8');

// 2. Create systemd service file
fs.writeFileSync('/tmp/netrum-service.tmp', serviceTemplate);
execSync('sudo mv /tmp/netrum-service.tmp /etc/systemd/system/netrum-node.service');
execSync('sudo chmod 644 /etc/systemd/system/netrum-node.service');

// 3. Create log directory
execSync('sudo mkdir -p /var/log/netrum');
execSync('sudo touch /var/log/netrum-node.log');
execSync('sudo touch /var/log/netrum-node.error.log');
execSync('sudo chown root:root /var/log/netrum-node.*');

// 4. Enable and start service
execSync('sudo systemctl daemon-reload');
execSync('sudo systemctl enable netrum-node.service');
execSync('sudo systemctl start netrum-node.service');

// 5. Create node ID file if not exists
if (!fs.existsSync('/root/netrum-lite-node/data/node/id.txt')) {
  execSync('mkdir -p /root/netrum-lite-node/data/node');
  execSync('uuidgen > /root/netrum-lite-node/data/node/id.txt');
}

console.log('Netrum Node Service has been installed successfully!');
console.log('\nTo check service status:');
console.log('sudo systemctl status netrum-node.service');
console.log('\nTo view live logs:');
console.log('sudo tail -f /var/log/netrum-node.log');
