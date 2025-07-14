#!/usr/bin/env node
import { ethers } from 'ethers';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Config
const API_URL = 'https://api.netrumlabs.com/api/node/mining/';
const RPC_URL = 'https://mainnet.base.org';
const CHAIN_ID = 8453; // Base Sepolia
const POLL_INTERVAL = 10000; // 10 seconds

// Systemd logging setup
process.stdout._handle.setBlocking(true);
process.stderr._handle.setBlocking(true);

function syslog(message) {
  // Use stderr which systemd captures by default
  process.stderr.write(`[${new Date().toISOString()}] ${message}\n`);
}

// Get wallet info
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyFile = path.resolve(__dirname, '../../wallet/key.txt');

async function main() {
  try {
    // Load wallet
    const { address, privateKey } = await loadWallet();
    const shortAddress = `${address.slice(0,6)}...${address.slice(-4)}`;
    syslog(`?? Mining Node: ${address}`);
    console.log(`?? Mining Node: ${shortAddress}\n`);

    // Initial setup
    let isMining = false;
    
    // Check if we need to start mining
    const { txData, liveInfo } = await getMiningData(address);
    if (txData && !liveInfo.isActive) {
      syslog('?? Starting mining session...');
      console.log('?? Starting mining session...');
      await submitTransaction(privateKey, { ...txData, chainId: CHAIN_ID });
      isMining = true;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Live monitoring loop
    syslog('?? Starting live monitoring');
    console.log('\n?? Live Mining Logs (updates every 10 seconds):');
    console.log('----------------------------------------');
    
    while (true) {
      const { liveInfo } = await getMiningData(address);
      
      // Prepare log data
      const stats = formatStats(liveInfo);
      
      // Log to systemd
      syslog(`MINING STATUS | ${stats.oneLine}`);
      
      // Display to console in one line
      process.stdout.write('\x1Bc'); // Clear terminal
      console.log(` ⏱️ ${stats.timeRemaining} | ${stats.percentComplete} | Stats: > ${stats.oneLine}`);
      
      // Exit loop if mining session ended
      if (!liveInfo.isActive && isMining) {
        syslog('⏹️ Mining session completed');
        console.log('\n⏹️  Mining session completed!');
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }

  } catch (err) {
    syslog(`❌ ERROR: ${err.message}`);
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

function formatStats(info) {
  return {
    timeRemaining: formatTime(info.timeRemaining),
    progressBar: createProgressBar(info.percentComplete),
    percentComplete: info.percentComplete.toFixed(2) + '%',
    oneLine: `Mined: ${formatTokens(info.minedTokens)} NPT | Speed: ${
      formatTokens(info.speedPerSec)}/s | Status: ${
      info.isActive ? '✅ ACTIVE' : '❌ INACTIVE'}`
  };
}

// Helper functions
function createProgressBar(percent) {
  const filled = '▓'.repeat(Math.floor(percent/5));
  const empty = '░'.repeat(20 - Math.floor(percent/5));
  return `[${filled}${empty}]`;
}

async function loadWallet() {
  const data = JSON.parse(await fs.readFile(keyFile, 'utf-8'));
  const privateKey = data.privateKey?.replace('0x', '');
  const address = data.address?.trim();
  
  if (!privateKey || !address?.startsWith('0x')) {
    throw new Error('Invalid wallet key.txt format');
  }
  return { address, privateKey };
}

async function getMiningData(address) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodeAddress: address })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || json.message || 'API error');
  return json;
}

async function submitTransaction(privateKey, tx) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(privateKey, provider);
  const txResponse = await signer.sendTransaction(tx);
  const msg = `✅ TX submitted: https://basescan.org/tx/${txResponse.hash}`;
  syslog(msg);
  console.log(msg);
}

function formatTokens(wei) {
  return (Number(wei) / 1e18).toFixed(6);
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

// Run
main();
