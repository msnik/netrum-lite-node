#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, 'speedtest.txt');
const fallbackTestURL = 'https://proof.ovh.net/files/10Mb.dat';
const tempFilePath = path.join(__dirname, 'temp_test_file');

// Minimum speed threshold
const MIN_SPEED = 5; // Mbps

console.log("🌐 Checking Internet Speed...");

// Main function
async function runSpeedTest() {
  // 🥇 Try speedtest-cli
  try {
    console.log("📡 Running speedtest-cli...");
    const output = execSync("speedtest-cli --secure --simple", { timeout: 30000 }).toString();
    const download = parseFloat((output.match(/Download:\s+([\d.]+)/) || [])[1]);
    const upload = parseFloat((output.match(/Upload:\s+([\d.]+)/) || [])[1]);

    if (download && upload) {
      console.log(`⬇️  Download: ${download.toFixed(2)} Mbps`);
      console.log(`⬆️  Upload  : ${upload.toFixed(2)} Mbps`);
      fs.writeFileSync(outputFile, `${download.toFixed(2)} ${upload.toFixed(2)}`);
      return true;
    }
  } catch {
    console.log("⚠️  speedtest-cli failed. Trying fallback...");
  }

  // 🥈 Try fast-cli
  try {
    console.log("🚀 Trying fast-cli...");
    const fast = execSync("fast --upload --json", { timeout: 30000 }).toString();
    const json = JSON.parse(fast);
    const download = json.downloadSpeed / 1e6;
    const upload = json.uploadSpeed / 1e6;

    console.log(`⬇️  Download: ${download.toFixed(2)} Mbps (fast.com)`);
    console.log(`⬆️  Upload  : ${upload.toFixed(2)} Mbps (fast.com)`);
    fs.writeFileSync(outputFile, `${download.toFixed(2)} ${upload.toFixed(2)}`);
    return true;
  } catch {
    console.log("⚠️  fast-cli failed. Trying manual speed test...");
  }

  // 🥉 Fallback: manual download test
  try {
    console.log("📥 Performing manual download test...");
    const start = Date.now();
    const file = fs.createWriteStream(tempFilePath);

    await new Promise((resolve, reject) => {
      https.get(fallbackTestURL, (res) => {
        res.pipe(file);
        res.on("error", reject);
        file.on("finish", () => file.close(resolve));
      }).on("error", reject);
    });

    const elapsed = (Date.now() - start) / 1000;
    const fileSize = fs.statSync(tempFilePath).size; // in bytes
    fs.unlinkSync(tempFilePath); // cleanup

    const downloadMbps = ((fileSize * 8) / 1e6) / elapsed;
    console.log(`⬇️  Approximate Download: ${downloadMbps.toFixed(2)} Mbps`);
    console.log("⬆️  Upload: Unknown (skipped)");

    fs.writeFileSync(outputFile, `${downloadMbps.toFixed(2)} 0`);
    return true;
  } catch (err) {
    console.error("❌ Manual fallback also failed:", err.message);
    return false;
  }
}

// Run everything
runSpeedTest().then((success) => {
  if (success) {
    const [d, u] = fs.readFileSync(outputFile, "utf8").split(" ").map(parseFloat);
    if (d < MIN_SPEED || u < MIN_SPEED) {
      console.warn(`⚠️  Warning: Download or Upload below ${MIN_SPEED} Mbps`);
    } else {
      console.log(`✅ Speed test complete. Saved to ${outputFile}`);
    }
  } else {
    console.error("❌ Could not complete any speed test method.");
    process.exit(1);
  }
});
