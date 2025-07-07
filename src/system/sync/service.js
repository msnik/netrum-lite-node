#!/usr/bin/env node
import axios from 'axios';
import os from 'os';
import fs from 'fs';
import diskusage from 'diskusage';

const API_URL = 'https://api.netrumlabs.com/api/node/metrics/sync/';
const LOG_FILE = '/var/log/netrum-node.log';
const SYNC_INTERVAL = 5000; // 5 seconds
let nodeStatus = 'Pending'; // Track node status globally

// Fixed requirements for Lite node
const NODE_REQUIREMENTS = {
  RAM: 4,       // 4GB
  CORES: 2,     // 2 CPU cores
  STORAGE: 50  // 50GB
};

// Logging function
function log(message) {
  const timestamp = new Date().toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).toLowerCase();
  
  const logMessage = `[${timestamp}] ${message}`;
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
  console.log(logMessage);
}

// Check system resources and requirements
function getSystemStatus() {
  try {
    const actualCores = os.cpus().length;
    const actualRamGB = os.totalmem() / (1024 ** 3);
    const actualStorageGB = diskusage.checkSync('/').free / (1024 ** 3);

    const meetsRequirements = actualCores >= NODE_REQUIREMENTS.CORES && 
                            actualRamGB >= NODE_REQUIREMENTS.RAM && 
                            actualStorageGB >= NODE_REQUIREMENTS.STORAGE;

    return {
      meetsRequirements,
      actualCores,
      actualRamGB,
      actualStorageGB,
      metrics: {
        cpu: NODE_REQUIREMENTS.CORES,
        ram: NODE_REQUIREMENTS.RAM,
        storage: NODE_REQUIREMENTS.STORAGE,
        nodeStatus // Include current node status in metrics
      }
    };
  } catch (error) {
    log(`Error checking system status: ${error.message}`);
    return { 
      meetsRequirements: false,
      metrics: null 
    };
  }
}

// Sync node status with server
async function syncWithServer() {
  try {
    const nodeId = fs.readFileSync('../../../data/node/id.txt', 'utf8').trim();
    const walletPath = fs.readFileSync('../../../data/wallet/key.txt', 'utf8').trim();;
    const walletdata = JSON.parse(walletPath);
    const walletAddress = walletdata.address
    const systemStatus = getSystemStatus();

    if (!systemStatus.meetsRequirements || !systemStatus.metrics) {
      nodeStatus = 'InActive';
      log(`System doesn't meet minimum requirements or error occurred`);
      return;
    }

    const response = await axios.post(API_URL, {
      nodeId,
      walletAddress,
      nodeType: 'Lite',
      metrics: systemStatus.metrics,
      status: nodeStatus, // Send current node status
      timestamp: new Date().toISOString()
    }, { timeout: 5000 });

    // Update status based on server response
    nodeStatus = response.data.success ? 'Active' : 'InActive';
    log(`Sync successful | Status: ${nodeStatus} | Metrics sent: ${JSON.stringify(systemStatus.metrics)}`);
    log(`Actual system - CPU: ${systemStatus.actualCores} | RAM: ${systemStatus.actualRamGB.toFixed(2)}GB | Storage: ${systemStatus.actualStorageGB.toFixed(2)}GB`);

  } catch (error) {
    nodeStatus = 'InActive';
    log(`Sync failed: ${error.message}`);
  }
}

// Main execution
log('Netrum Lite Node Service Started');
log(`Node Requirements: ${NODE_REQUIREMENTS.CORES} cores, ${NODE_REQUIREMENTS.RAM}GB RAM, ${NODE_REQUIREMENTS.STORAGE}GB storage`);

// Initial sync
syncWithServer();

// Regular sync every 5 seconds
const syncInterval = setInterval(syncWithServer, SYNC_INTERVAL);

// Handle process termination
process.on('SIGINT', () => {
  clearInterval(syncInterval);
  log('Service stopped');
  process.exit();
});
