// src/identity/sign-Message.js
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

const walletData = fs.readFileSync('data/wallet/key.txt', 'utf8').trim();

let wallet;
try {
  const parsed = JSON.parse(walletData);
  wallet = new ethers.Wallet(parsed.privateKey);
} catch {
  wallet = new ethers.Wallet(walletData);
}

const nodeId = fs.readFileSync('data/node/id.txt', 'utf8').trim();
const timestamp = Math.floor(Date.now() / 1000);

// Encode message exactly as per contract
const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
  ['string', 'address', 'uint256'],
  [nodeId, wallet.address, timestamp]
);

const messageHash = ethers.keccak256(encoded);
const signature = await wallet.signMessage(ethers.getBytes(messageHash));

// ✅ Print in shell
console.log(`🧾 Signing Details:
Node ID:      ${nodeId}
Signer Addr:  ${wallet.address}
Timestamp:    ${timestamp}
Message Hash: ${messageHash}
Signature:    ${signature}
`);

// ✅ Save properly to txt
const out = `NodeID: ${nodeId}
SignerAddress: ${wallet.address}
Timestamp: ${timestamp}
Signature: ${signature}
`;

fs.writeFileSync('src/identity/signMessage.txt', out);
console.log('✅ Signature saved to src/identity/signMessage.txt');
