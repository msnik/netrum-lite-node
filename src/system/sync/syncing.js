#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

/* ── Paths ─────────────────────────────────────────────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, './service.txt');
const serviceDest = '/etc/systemd/system/netrum-node.service';
const logDir = '/var/log/netrum';
const logFile = `${logDir}/netrum-node.log`;
const errorFile = `${logDir}/netrum-node.error.log`;

/* ── Step 1: Write systemd service file ─────────────────── */
const serviceTemplate = fs.readFileSync(templatePath, 'utf8');
fs.writeFileSync('/tmp/netrum-service.tmp', serviceTemplate);
execSync(`sudo mv /tmp/netrum-service.tmp ${serviceDest}`);
execSync(`sudo chmod 644 ${serviceDest}`);

/* ── Step 2: Prepare logs ───────────────────────────────── */
execSync(`sudo mkdir -p ${logDir}`);
execSync(`sudo touch ${logFile}`);
execSync(`sudo touch ${errorFile}`);
execSync(`sudo chown root:root ${logFile} ${errorFile}`);

/* ── Step 3: Reload and start service ───────────────────── */
execSync('sudo systemctl daemon-reload');
execSync('sudo systemctl enable netrum-node.service');
execSync('sudo systemctl restart netrum-node.service');

/* ── Final Output ───────────────────────────────────────── */
console.log('✅   Netrum Node Sync service installed.');
console.log('\nCheck status:\n  sudo systemctl status netrum-node.service');
console.log('\nLive logs:\n  netrum-sync-log');
