// src/identity/sign/SignMsg.js
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path helper function
const getAbsolutePath = (relativePath) => {
  return path.resolve(__dirname, relativePath);
};

try {
  // Read wallet key - path to src/wallet/key.txt from src/identity/sign/
  const walletKeyPath = getAbsolutePath('../../wallet/key.txt');
  console.log(`Looking for wallet key at: ${walletKeyPath}`);
  
  if (!fs.existsSync(walletKeyPath)) {
    throw new Error(`Wallet key file not found at: ${walletKeyPath}\nPlease run 'netrum-wallet' first to create a wallet.`);
  }
  
  const walletData = fs.readFileSync(walletKeyPath, 'utf8').trim();
  let wallet;
  
  try {
    const parsed = JSON.parse(walletData);
    wallet = new ethers.Wallet(parsed.privateKey);
  } catch {
    wallet = new ethers.Wallet(walletData);
  }

  // Read node ID - path to src/identity/node-id/id.txt from src/identity/sign/
  const nodeIdPath = getAbsolutePath('../node-id/id.txt');
  console.log(`Looking for node ID at: ${nodeIdPath}`);
  
  if (!fs.existsSync(nodeIdPath)) {
    throw new Error(`Node ID file not found at: ${nodeIdPath}\nPlease register your node first.`);
  }
  
  const nodeId = fs.readFileSync(nodeIdPath, 'utf8').trim();
  const timestamp = Math.floor(Date.now() / 1000);

  // Encode message exactly as per contract
  const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ['string', 'address', 'uint256'],
    [nodeId, wallet.address, timestamp]
  );
  
  const messageHash = ethers.keccak256(encoded);
  const signature = await wallet.signMessage(ethers.getBytes(messageHash));

  // Print in shell
  console.log(`
?? Signing Details:
---------------------------------
Node ID:      ${nodeId}
Signer Addr:  ${wallet.address}
Timestamp:    ${timestamp}
Message Hash: ${messageHash}
Signature:    ${signature}
---------------------------------
`);

  // Save to file
  const out = `NodeID: ${nodeId}
SignerAddress: ${wallet.address}
Timestamp: ${timestamp}
Signature: ${signature}
`;

  const outputPath = getAbsolutePath('./signMsg.txt');
  fs.writeFileSync(outputPath, out);
  console.log(`✅ Signature saved to: ${outputPath}`);

} catch (error) {
  console.error('\n❌ Error generating signature:');
  console.error(error.message);
  console.log('\nℹ️  Please ensure:');
  console.log('1. You have created a wallet (netrum-wallet)');
  console.log('2. Your node is properly registered');
  console.log('3. All required files exist in correct locations\n');
  process.exit(1);
}
