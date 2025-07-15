#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import os from 'os';
import fs from 'fs';
import axios from 'axios';
import diskusage from 'diskusage';

const speedTest = require('speedtest-net');

const API_URL = 'https://api.netrumlabs.com/api/node/metrics/sync/';
const SYNC_INTERVAL = 5000;

function log(msg) {
  process.stderr.write(`[${new Date().toISOString()}] ${msg}\n`);
}

function getSystemInfo(speed) {
  try {
    const cores = os.cpus().length;
    const ram = os.totalmem() / (1024 ** 2); // in MB
    const disk = diskusage.checkSync('/').free / (1024 ** 3); // in GB

    return {
      cpu: cores,
      ram: Math.round(ram),
      disk: Math.round(disk),
      speed: Math.round(speed),
      lastSeen: Math.floor(Date.now() / 1000),
    };
  } catch (err) {
    return null;
  }
}

async function getSpeedMbps() {
  try {
    const result = await speedTest({ acceptLicense: true, acceptGdpr: true });
    const mbps = result.download.bandwidth / 125000; // Convert bytes/sec to Mbps
    return mbps;
  } catch (err) {
    log('⚠️ Speedtest failed, setting speed = 0');
    return 0;
  }
}

async function syncWithServer() {
  try {
    const nodeId = fs.readFileSync('../../identity/node-id/id.txt', 'utf8').trim();

    const speed = await getSpeedMbps();
    const metrics = getSystemInfo(speed);

    if (!metrics) {
      log('❌ Failed to get system info');
      return;
    }

    const response = await axios.post(API_URL, {
      nodeId,
      nodeMetrics: metrics,
      nodeStatus: (metrics.cpu >= 2 && metrics.ram >= 4096 && metrics.disk >= 50) ? 'Active' : 'InActive'
    });

    if (response.data.log) {
      log(response.data.log);
    }
  } catch (err) {
    if (err.response?.data?.error === 'Not Registered') {
      log('❌ Node not registered');
    } else {
      log('❌ Sync error: ' + err.message);
    }
  }
}

log('🚀 Netrum Node Sync Service Started...');
syncWithServer();
setInterval(syncWithServer, SYNC_INTERVAL);
