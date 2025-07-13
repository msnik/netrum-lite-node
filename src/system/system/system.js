#!/usr/bin/env node

import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import diskusage from 'diskusage';

// ========== Path Setup ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const speedtestPath = path.join(__dirname, 'speedtest.js');
const requirementsPath = path.join(__dirname, 'requirements.js');
const speedFile = path.join(__dirname, 'speedtest.txt');

// ========== Config ==========
const MIN_REQUIREMENTS = {
  RAM: 4,      // in GB
  DISK: 50,    // in GB
  CPU: 2,      // cores
  DOWNLOAD: 10, // Mbps
  UPLOAD: 5    // Mbps
};

// ========== Helpers ==========
function runScript(scriptPath) {
  try {
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`❌ Error running ${scriptPath}:`, err.message);
    process.exit(1);
  }
}

function readSpeedData() {
  if (!fs.existsSync(speedFile)) {
    console.error('❌ Speedtest results not found. Run speedtest.js first.');
    process.exit(1);
  }
  const [download, upload] = fs.readFileSync(speedFile, 'utf8').trim().split(' ').map(parseFloat);
  return { download, upload };
}

// ========== Power Scoring ==========
function calculatePowerScore(download, upload) {
  const cpuCores = os.cpus().length;
  const totalRAM = os.totalmem() / (1024 ** 3); // GB
  const freeDisk = diskusage.checkSync('/').free / (1024 ** 3); // GB

  const power = {
    cpu: Math.min(cpuCores * 10, 40),
    ram: Math.min(totalRAM * 15, 60),
    disk: Math.min(freeDisk * 0.2, 40),
    network: Math.min(download * 2 + upload * 1, 50),
    get total() {
      return this.cpu + this.ram + this.disk + this.network;
    }
  };

  return {
    ...power,
    cpuCores,
    totalRAM: totalRAM.toFixed(1),
    freeDisk: freeDisk.toFixed(1),
    download,
    upload
  };
}

// ========== Full System Check ==========
async function fullSystemCheck() {
  console.log('\n?? Starting Comprehensive System Check...\n');

  // Step 1: Run speedtest.js
  console.log('?? [1/3] Running Network Speed Test...');
  runScript(speedtestPath);
  const { download, upload } = readSpeedData();
  console.log(`✅ Speed Test Completed — Download: ${download} Mbps, Upload: ${upload} Mbps\n`);

  // Step 2: Run requirements.js
  console.log('?? [2/3] Checking Minimum System Requirements...');
  runScript(requirementsPath);

  // Step 3: Calculate power score
  console.log('\n⚡ [3/3] Calculating Node Power Score...');
  const power = calculatePowerScore(download, upload);

  console.log(`\n?? Power Breakdown:`);
  console.log(`- CPU Power     : ${power.cpu} (${power.cpuCores} cores)`);
  console.log(`- RAM Power     : ${power.ram} (${power.totalRAM} GB)`);
  console.log(`- Disk Power    : ${power.disk} (${power.freeDisk} GB Free)`);
  console.log(`- Network Power : ${power.network} (${power.download}↓ / ${power.upload}↑ Mbps)`);

  console.log(`\n?? TOTAL POWER SCORE: ${power.total} / 190\n`);

  if (power.total < 100) {
    console.log('❌  System does not meet minimum power requirements (100)');
    process.exit(1);
  } else {
    console.log('✅  All checks passed! System is ready for Netrum Lite Node operation.');
  }
}

// ========== Start ==========
fullSystemCheck().catch(err => {
  console.error('❌ Unexpected error:', err.message);
});
