#!/usr/bin/env node
import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import diskusage from 'diskusage';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MIN_REQUIREMENTS = {
  RAM: 4, // GB
  DISK: 50, // GB
  DOWNLOAD: 10, // Mbps
  UPLOAD: 5, // Mbps
  CPU: 2 // Cores
};

// Paths to shell scripts
const SPEEDTEST_PATH = path.join(__dirname, 'speedtest.sh');
const REQUIREMENTS_PATH = path.join(__dirname, 'requirements.sh');

// Run shell script and return output
function runScript(scriptPath) {
  try {
    return execSync(`bash ${scriptPath}`).toString();
  } catch (error) {
    console.error(`Error running ${scriptPath}:`, error.message);
    process.exit(1);
  }
}

// Main system check function
async function fullSystemCheck() {
  console.log('🚀 Starting comprehensive system check...\n');

  // 1. Run speed test
  console.log('=== NETWORK SPEED TEST ===');
  runScript(SPEEDTEST_PATH);
  const speedData = fs.readFileSync('../../tmp/speedtest.txt', 'utf8').split(' ');
  const [download, upload] = speedData.map(parseFloat);
  console.log(`✅ Speed Test Completed - Download: ${download}Mbps, Upload: ${upload}Mbps\n`);

  // 2. Check system requirements
  console.log('=== SYSTEM REQUIREMENTS CHECK ===');
  runScript(REQUIREMENTS_PATH);
  
  // 3. Calculate power score
  console.log('\n=== POWER CALCULATION ===');
  const power = calculatePowerScore();
  console.log('🔋 Power Breakdown:');
  console.log(`- CPU Power: ${power.cpu} (${os.cpus().length} cores)`);
  console.log(`- RAM Power: ${power.ram} (${(os.totalmem() / (1024 ** 3)).toFixed(1)}GB)`);
  console.log(`- Disk Power: ${power.disk} (${(diskusage.checkSync('/').free / (1024 ** 3)).toFixed(1)}GB free)`);
  console.log(`- Network Power: ${power.network} (${download}Mbps↓/${upload}Mbps↑)`);
  console.log(`💪 TOTAL POWER SCORE: ${power.total}/190\n`);

  // 4. Final verification
  if (power.total < 100) {
    console.log('❌ System does not meet minimum power requirements (100)');
    process.exit(1);
  }

  console.log('✅ All checks passed! System is ready for Lite Node operation.');
}

// Power calculation function
function calculatePowerScore() {
  const cpuCores = os.cpus().length;
  const totalRAM = os.totalmem() / (1024 ** 3); // GB
  const freeDisk = diskusage.checkSync('/').free / (1024 ** 3);
  const [download, upload] = fs.readFileSync('/tmp/speedtest.txt', 'utf8')
    .split(' ')
    .map(parseFloat);

  const power = {
    cpu: Math.min(cpuCores * 10, 40),      // Max 40 (4 cores)
    ram: Math.min(totalRAM * 15, 60),      // Max 60 (4GB)
    disk: Math.min(freeDisk * 0.2, 40),    // Max 40 (200GB)
    network: Math.min(download * 2 + upload * 1, 50), // Max 50
    get total() {
      return this.cpu + this.ram + this.disk + this.network;
    }
  };

  return power;
}

// Execute the full check
fullSystemCheck().catch(console.error);
