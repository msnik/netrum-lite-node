import { Wallet } from "ethers";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read private key from user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

const run = async () => {
  const privateKey = await ask("?? Set Private key (must start with 0x): ");
  rl.close();

  if (!privateKey.startsWith("0x")) {
    console.error("❌ Private key must start with '0x'");
    return;
  }

  try {
    const wallet = new Wallet(privateKey.trim());

    console.log("✅ Wallet Imported:");
    console.log("Address:", wallet.address);
    console.log("Private Key:", wallet.privateKey);

    const walletData = JSON.stringify(
      {
        address: wallet.address,
        privateKey: wallet.privateKey,
      },
      null,
      2
    );

    // ✅ Save to data/wallet/key.txt
    const dataDir = path.join(__dirname, "../../data/wallet");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(path.join(dataDir, "key.txt"), walletData);
    console.log(`?? Saved to ${path.join(dataDir, "key.txt")}`);

    // ✅ Also save to src/wallet/key.txt
    fs.writeFileSync(path.join(__dirname, "key.txt"), walletData);
    console.log(`?? Also saved to ${path.join(__dirname, "key.txt")}`);

  } catch (err) {
    console.error("❌ Invalid private key. Please try again.");
  }
};

run();
