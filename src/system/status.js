#!/usr/bin/env node
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current module path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_URL = 'https://api.netrumlabs.com/api/node/status/';
const ID_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'node', 'id.txt');
const CHECK_INTERVAL = 5000; // 5 seconds
const LOG_FILE = path.join(__dirname, 'node_status.log');

// Read node ID from file
function getNodeId() {
  try {
    return fs.readFileSync(ID_FILE_PATH, 'utf8').trim();
  } catch (error) {
    logError(`Failed to read node ID file: ${error.message}`);
    process.exit(1);
  }
}

// Log messages with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

// Log errors
function logError(message) {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ERROR: ${message}`;
  console.error(errorMessage);
  fs.appendFileSync(LOG_FILE, errorMessage + '\n');
}

// Check node status with the API
async function checkNodeStatus(nodeId) {
  try {
    const response = await axios.get(API_URL, {
      params: { nodeId },
      timeout: 3000,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.status) {
      return response.data.status;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    if (error.response) {
      logError(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      logError('No response received from API server');
    } else {
      logError(`Request error: ${error.message}`);
    }
    return 'InActive';
  }
}

// Main function
async function main() {
  log('Starting node status monitor');
  const nodeId = getNodeId();
  log(`Node ID: ${nodeId}`);
  log(`API URL: ${API_URL}?nodeId=${nodeId}`);

  // Initial check
  let status = await checkNodeStatus(nodeId);
  log(`Current status: ${status}`);

  // Periodic checking
  setInterval(async () => {
    const newStatus = await checkNodeStatus(nodeId);
    if (newStatus !== status) {
      status = newStatus;
      log(`Status changed to: ${status}`);
    }
  }, CHECK_INTERVAL);
}

// Handle process termination
process.on('SIGINT', () => {
  log('Stopping node status monitor');
  process.exit();
});

// Start the application
main().catch(err => {
  logError(`Fatal error: ${err.message}`);
  process.exit(1);
});
