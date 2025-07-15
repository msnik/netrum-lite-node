#!/usr/bin/env node
import axios     from 'axios';
import os        from 'os';
import fs        from 'fs';
import diskusage from 'diskusage';
import speedTest from 'speedtest-net';

const API_URL       = 'https://api.netrumlabs.com/api/node/metrics/sync/';
const SYNC_INTERVAL = 5000;          // 5 sec
const SPEED_REFRESH = 12 * 60 * 1000; 

// ---------------- Systemd-friendly log -------------
process.stdout._handle.setBlocking(true);
process.stderr._handle.setBlocking(true);
function log(msg) {
  process.stderr.write(`[${new Date().toISOString()}] ${msg}\n`);
}

// ---------------- Collect metrics -----------------
const REQUIREMENTS = { RAM: 4, CORES: 2, STORAGE: 50 };

let cachedSpeed = 0;
async function refreshSpeed() {
  try {
    const res = await speedTest({ maxTime: 5000 });
    cachedSpeed = Math.round(res.download.bandwidth / 125000); // Bytes/s → Mbps
    log(`Internet speed refreshed: ${cachedSpeed} Mbps`);
  } catch {
    // speed test fail → 0 Mbps
    cachedSpeed = 0;
  }
}

refreshSpeed();

setInterval(refreshSpeed, SPEED_REFRESH);

function collectMetrics() {
  const cores   = os.cpus().length;
  const ramGB   = os.totalmem() / 1024 ** 3;
  const diskGB  = diskusage.checkSync('/').free / 1024 ** 3;

  return {
    cpu   : cores,
    ram   : Math.round(ramGB  * 1024),   // MB 
    disk  : Math.round(diskGB),          // GB
    speed : cachedSpeed,                 // Mbps
  };
}

function deriveStatus({ cpu, ram, disk }) {
  const ok =
    cpu          >= REQUIREMENTS.CORES   &&
    ram / 1024   >= REQUIREMENTS.RAM     && // MB → GB
    disk         >= REQUIREMENTS.STORAGE;
  return ok ? 'Active' : 'InActive';
}

// ---------------- Main sync function ---------------
async function syncWithServer() {
  try {
    const nodeId     = fs.readFileSync('../../identity/node-id/id.txt', 'utf8').trim();
    const nodeMetrics = collectMetrics();
    const nodeStatus  = deriveStatus(nodeMetrics);

    const res = await axios.post(API_URL, { nodeId, nodeMetrics, nodeStatus });
    if (res.data.log) log(res.data.log);
  } catch (err) {
    if (err.response?.data?.error === 'Not Registered') {
      log('⛔ Node not registered on server');
    } else {
      log(`⚠️ Sync error: ${err.message}`);
    }
  }
}

// ---------------- Bootstrap -------------------------
log('🚀 Netrum Node Sync Service started');
syncWithServer();
setInterval(syncWithServer, SYNC_INTERVAL);
