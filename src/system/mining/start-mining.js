#!/usr/bin/env node
import { ethers } from 'ethers';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/* ---------- config ---------- */
const API_URL = 'https://api.netrumlabs.com/api/node/mining/start-mining/';
const RPC_URL = 'https://mainnet.base.org';
const CHAIN_ID = 8453;               // Base Mainnet

/* ---------- logging ---------- */
process.stdout._handle.setBlocking(true);
process.stderr._handle.setBlocking(true);
const log = (m) => process.stderr.write(`[${new Date().toISOString()}] ${m}\n`);

/* ---------- wallet ---------- */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyFile = path.resolve(__dirname, '../../wallet/key.txt');

async function loadWallet() {
  const { privateKey, address } = JSON.parse(await fs.readFile(keyFile, 'utf-8'));
  if (!address || !privateKey) throw new Error('wallet/key.txt missing data');
  return { address, privateKey: privateKey.replace(/^0x/, '') };
}

/* ---------- main ---------- */
(async () => {
  try {
    const { address, privateKey } = await loadWallet();
    const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
    log(`⛏️ Node: ${address}`);
    console.log(`⛏️ Mining Node: ${short}`);

    /* --- hit start-mining API --- */
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeAddress: address })
    }).then((r) => r.json());

    if (!res.success) throw new Error(res.error || 'API error');

    if (res.status === 'already_mining') {
      console.log('✅ Mining already active – no TX needed.');
      return;
    }
    if (res.status !== 'ready_to_mine' || !res.txData) {
      throw new Error(res.message || 'Unexpected API response');
    }

    /* --- sign & submit tx --- */
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(privateKey, provider);
    const txResp = await signer.sendTransaction({ ...res.txData, chainId: CHAIN_ID });
    console.log(`✅ TX submitted: https://basescan.org/tx/${txResp.hash}`);

  } catch (err) {
    log(`❌ ${err.message}`);
    process.exit(1);
  }
})();
