#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Setup current dir - SINGLE DECLARATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ── Paths ─────────────────────────────────────────────── */
const templatePath = path.join(__dirname, './mining.txt');
const serviceDest = '/etc/systemd/system/netrum-mining.service';
const logDir = '/var/log/netrum';
const logFile = `${logDir}/netrum-mining.log`;
const errorFile = `${logDir}/netrum-mining.error.log`;

/* ── Write systemd service file ─────────────────── */
try {
    // Create log directory if it doesn't exist
    execSync(`sudo mkdir -p ${logDir}`);
    execSync(`sudo chown ${process.env.USER} ${logDir}`);
    
    const serviceTemplate = fs.readFileSync(templatePath, 'utf8');
    fs.writeFileSync('/tmp/netrum-service.tmp', serviceTemplate);
    
    // Move and set permissions
    execSync(`sudo mv /tmp/netrum-service.tmp ${serviceDest}`);
    execSync(`sudo chmod 644 ${serviceDest}`);
    
    // Enable and start service
    execSync('sudo systemctl daemon-reload');
    execSync('sudo systemctl enable netrum-mining.service');
    execSync('sudo systemctl restart netrum-mining.service');
    
    /* ── Final Output ───────────────────────────────────────── */
    console.log('✅ Netrum Node Mining service installed successfully.');
    console.log('\nCommands:');
    console.log('  Check status:  sudo systemctl status netrum-mining.service');
    console.log('  View logs:     sudo journalctl -u netrum-mining.service -f');
    console.log('  Stop service:  sudo systemctl stop netrum-mining.service');
    
} catch (error) {
    console.error('❌ Installation failed:');
    console.error(error.message);
    process.exit(1);
}
