#!/usr/bin/env node
import axios from 'axios';
import os from 'os';
import fs from 'fs';
import diskusage from 'diskusage';

const API_URL = 'https://api.netrumlabs.com/api/node/metrics/sync/';
const SYNC_INTERVAL = 5000;

process.stdout._handle.setBlocking(true);
process.stderr._handle.setBlocking(true);

// === Helper to Print Logs to systemd ===
function log(message) {
  // Use stderr which systemd shows by default
  process.stderr.write(`[${new Date().toISOString()}] ${message}\n`);
}

function checkSystem() {
  try {
    const cores = os.cpus().length;
    const ram = os.totalmem() / (1024 ** 3);
    const storage = diskusage.checkSync('/').free / (1024 ** 3);

    return {
      nodeMetrics: cores >= 2 && ram >= 4 && storage >= 50,
      nodeStatus: (cores >= 2 && ram >= 4 && storage >= 50) ? 'Active' : 'InActive'
    };
  } catch {
    return {
      nodeMetrics: false,
      nodeStatus: 'InActive' 
    };
  }
}

async function syncWithServer() {
  try {
    const nodeId = fs.readFileSync('../../identity/node-id/id.txt', 'utf8').trim();
    const { nodeMetrics, nodeStatus } = checkSystem();
    
    const response = await axios.post(API_URL, {
      nodeId,
      nodeMetrics, 
      nodeStatus
    });

    if (response.data.log) {
      log(response.data.log);
    }
  } catch (error) {
    if (error.response?.data?.error === 'Not Registered') {
      log('Not Registered');
    }
  }
}

// === Startup Log + Run Loop ===
log('?? Netrum Node Sync Service started');

// Initial sync
syncWithServer();

// Periodic sync
setInterval(syncWithServer, SYNC_INTERVAL);
