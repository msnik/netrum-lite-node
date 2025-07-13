#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const speedFile = path.join(__dirname, 'speedtest.txt');

// Log start
console.log("?? Checking Lite Node Requirements...");

// ========== 1. System Resources ==========

// RAM (in GB)
let RAM = 0;
try {
  const ramOut = execSync("free -g | awk '/^Mem:/{print $2}'").toString().trim();
  RAM = parseInt(ramOut, 10);
} catch {
  console.error("❌ Could not read RAM");
}

// Disk (in GB)
let DISK = 0;
try {
  const diskOut = execSync("df -h / | awk 'NR==2 {print $2}' | sed 's/G//'").toString().trim();
  DISK = parseFloat(diskOut);
} catch {
  console.error("❌ Could not read disk size");
}

// CPU Cores
let CPU = 0;
try {
  const cpuOut = execSync("nproc").toString().trim();
  CPU = parseInt(cpuOut, 10);
} catch {
  console.error("❌ Could not read CPU cores");
}

// ========== 2. Internet Speed ==========

let download = 0;
let upload = 0;

if (fs.existsSync(speedFile)) {
  try {
    const speedText = fs.readFileSync(speedFile, 'utf8').trim();
    [download, upload] = speedText.split(' ').map(val => parseFloat(val));
  } catch {
    console.error("❌ Could not read speedtest.txt");
  }
}

// ========== 3. Output Specs ==========

console.log("?? System Specs:");
console.log(`- RAM: ${RAM} GB`);
console.log(`- DISK: ${DISK} GB`);
console.log(`- CPU Cores: ${CPU}`);
console.log(`- Download Speed: ${download} Mbps`);
console.log(`- Upload Speed:   ${upload} Mbps`);

// ========== 4. Check Requirements ==========

let failed = false;

if (RAM < 4) {
  console.error("❌  RAM requirement not met (Minimum 4GB)");
  failed = true;
}

if (DISK < 50) {
  console.error("❌  Disk space requirement not met (Minimum 50GB)");
  failed = true;
}

if (download < 10) {
  console.error("❌  Download speed too low (Minimum 10 Mbps)");
  failed = true;
}

if (upload < 5) {
  console.error("❌  Upload speed too low (Minimum 5 Mbps)");
  failed = true;
}

if (failed) {
  console.error("?? System does not meet requirements");
  process.exit(1);
} else {
  console.log("✅  System meets all requirements");
}
