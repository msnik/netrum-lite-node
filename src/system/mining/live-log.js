#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/* ---------- config ---------- */
const API_URL = 'https://api.netrumlabs.com/api/node/mining/live-log/';

/* ---------- logging ---------- */
process.stdout._handle.setBlocking(true);
process.stderr._handle.setBlocking(true);
const log = (m) => process.stderr.write(`[${new Date().toISOString()}] ${m}\n`);

/* ---------- wallet ---------- */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyFile = path.resolve(__dirname, '../../wallet/key.txt');

async function loadAddress() {
  const { address } = JSON.parse(await fs.readFile(keyFile, 'utf-8'));
  if (!address) throw new Error('wallet/key.txt missing address');
  return address.trim();
}

/* ---------- helpers ---------- */
const fmtTokens = (wei) => (Number(wei) / 1e18).toFixed(6);
const fmtTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${h}h ${m}m ${sec}s`;
};

async function poll(address) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeAddress: address })
    }).then((r) => r.json());

    if (!res.success) throw new Error(res.error || 'API error');

    const info = res.liveInfo;
    const line = `⏱️ ${fmtTime(info.timeRemaining)} | ${info.percentComplete.toFixed(2)}% | `
               + `Stats: > Mined: ${fmtTokens(info.minedTokens)} NPT | `
               + `Speed: ${fmtTokens(info.speedPerSec)}/s | `
               + `Status: ${info.isActive ? '✅ ACTIVE' : '❌ INACTIVE'}`;

    // Clear terminal + print one-liner
    process.stdout.write('\x1Bc');
    console.log(line);

    if (!info.isActive && info.timeRemaining === 0) {
      log('⏹️ Mining finished');
      process.exit(0);
    }
  } catch (err) {
    log(`❌ ${err.message}`);
  }

  // Random wait (0 - 10 min)
  const randomDelay = Math.floor(Math.random() * 10 * 60 * 1000);
  log(`⏳ Next poll in ${(randomDelay / 1000).toFixed(0)} seconds`);
  setTimeout(() => poll(address), randomDelay);
}

/* ---------- main ---------- */
(async () => {
  try {
    const address = await loadAddress();
    log(`📡 Live log started for ${address}`);
    console.log('⏱️ Live Mining Log (random interval within 10 minutes)\n--------------------------------');

    await poll(address);
  } catch (err) {
    log(`❌ ${err.message}`);
    process.exit(1);
  }
})();
