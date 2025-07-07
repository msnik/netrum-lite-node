#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ID_FILE_PATH = path.join(__dirname, '..', '..', '..', 'data', 'node', 'id.txt');
const TOKEN_FILE_PATH = path.join(__dirname, 'mining-token.txt'); // Token must be saved here
const LOGS_DIR = path.join(__dirname, '..', '..', '..',  'data', 'mining');
const today = new Date().toISOString().split('T')[0];
const LOG_FILE = path.join(LOGS_DIR, `${today}.txt`);

// Logging
function logToFile(message) {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
  fs.appendFileSync(LOG_FILE, `${message}\n`);
  console.log(message);
}

// Save claim
function saveClaim(amount) {
  const claimFile = path.join(LOGS_DIR, 'claims.txt');
  const claimEntry = `CLAIMED ${new Date().toISOString()}: ${amount.toFixed(2)} NPT\n`;
  fs.appendFileSync(claimFile, claimEntry);
}

// Read nodeId
function getNodeId() {
  try {
    return fs.readFileSync(ID_FILE_PATH, 'utf8').trim();
  } catch (error) {
    logToFile(`❌ Error reading node ID: ${error.message}`);
    process.exit(1);
  }
}

// Read token
function getToken() {
  try {
    return fs.readFileSync(TOKEN_FILE_PATH, 'utf8').trim();
  } catch (error) {
    logToFile(`❌ Error reading mining token: ${error.message}`);
    process.exit(1);
  }
}

// Main mining logic
async function startMining() {
  const nodeId = getNodeId();
  const token = getToken();
  logToFile(`🔗 Starting mining for node: ${nodeId}`);

  try {
    const response = await fetch(`https://api.netrumlabs.com/api/node/mining?nodeId=${nodeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const { status, miningSpeed } = await response.json();

    if (status !== 'Active') {
      logToFile(`❌ Node inactive (Status: ${status}) - Mining stopped`);
      return;
    }

    logToFile(`⚡ Mining started | Speed: ${miningSpeed} NPT/s`);
    const endTime = Date.now() + 24 * 60 * 60 * 1000;
    let totalTokens = 0;
    let active = true;

    const interval = setInterval(async () => {
      if (!active || Date.now() >= endTime) {
        clearInterval(interval);
        if (Date.now() >= endTime) {
          const finalPayout = Math.min(totalTokens, 8.5);
          logToFile(`🎉 24 hours completed! Claim: ${finalPayout.toFixed(2)} NPT`);
          saveClaim(finalPayout);
        }
        return;
      }

      try {
        const statusCheck = await fetch(`https://api.netrumlabs.com/api/node/mining?nodeId=${nodeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!statusCheck.ok) throw new Error(`Status check failed: ${statusCheck.status}`);
        const { status: currentStatus } = await statusCheck.json();

        if (currentStatus !== 'Active') {
          active = false;
          logToFile(`❌ Mining stopped (Current status: ${currentStatus})`);
          return;
        }

        const tokensEarned = parseFloat(miningSpeed) * 5;
        totalTokens += tokensEarned;

        // ✅ Define timeNow here (inside try block)
        const timeNow = new Date().toLocaleTimeString();
        const formattedLog = `🛠️  ${timeNow} | 🟢 Status: ${currentStatus} | ⛏️  +${tokensEarned.toFixed(6)} NPT | 💰 Total: ${totalTokens.toFixed(6)} | ⚡ Speed: ${parseFloat(miningSpeed).toFixed(10)} NPT/s`;


        logToFile(formattedLog);

      } catch (error) {
        logToFile(`⚠️ Mining error: ${error.message}`);
      }

    }, 5000);

  } catch (error) {
    logToFile(`🚨 API connection failed: ${error.message}`);
  }
}

// Start
startMining().catch(err => {
  logToFile(`💥 Critical failure: ${err.message}`);
  process.exit(1);
});
