#!/usr/bin/env node
import { execSync, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, 'speedtest.txt');

// Configuration
const MIN_REQUIRED_SPEED = 5; // 5 Mbps minimum
const FALLBACK_TEST_URL = 'https://proof.ovh.net/files/10Mb.dat';

console.log("?? Checking Internet Speed...");

async function runSpeedtest() {
  try {
    // Try official speedtest-cli first
    console.log("?? Trying official speedtest-cli...");
    const result = execSync('speedtest-cli --simple', { timeout: 30000 }).toString();
    const downloadMatch = result.match(/Download:\s+([\d.]+)\s+Mbit\/s/);
    const uploadMatch = result.match(/Upload:\s+([\d.]+)\s+Mbit\/s/);

    if (downloadMatch && uploadMatch) {
      const download = parseFloat(downloadMatch[1]);
      const upload = parseFloat(uploadMatch[1]);
      
      console.log(`⬇️ Download: ${download.toFixed(2)} Mbps`);
      console.log(`⬆️ Upload: ${upload.toFixed(2)} Mbps`);
      
      fs.writeFileSync(outputFile, `${download} ${upload}`);
      console.log(`✅ Results saved to ${outputFile}`);
      
      if (download < MIN_REQUIRED_SPEED || upload < MIN_REQUIRED_SPEED) {
        console.warn(`⚠️  Warning: Speed below recommended minimum of ${MIN_REQUIRED_SPEED} Mbps`);
      }
      
      return true;
    }
  } catch (error) {
    console.log("⚠️  Official speedtest failed, trying alternative methods...");
  }

  // Fallback method 1: Fast.com (if available)
  try {
    console.log("?? Trying fast-cli...");
    const fastResult = execSync('fast --upload --json', { timeout: 30000 }).toString();
    const fastData = JSON.parse(fastResult);
    
    if (fastData.downloadSpeed && fastData.uploadSpeed) {
      const download = fastData.downloadSpeed / 1e6; // Convert from bps to Mbps
      const upload = fastData.uploadSpeed / 1e6;
      
      console.log(`⬇️ Download: ${download.toFixed(2)} Mbps (fast.com)`);
      console.log(`⬆️ Upload: ${upload.toFixed(2)} Mbps (fast.com)`);
      
      fs.writeFileSync(outputFile, `${download} ${upload}`);
      return true;
    }
  } catch {
    // Continue to next fallback
  }

  // Fallback method 2: Manual download test
  try {
    console.log("?? Performing manual bandwidth test...");
    const startTime = Date.now();
    const file = fs.createWriteStream(path.join(__dirname, 'temp_test_file'));
    
    await new Promise((resolve, reject) => {
      https.get(FALLBACK_TEST_URL, (response) => {
        response.pipe(file);
        let totalBytes = 0;
        
        response.on('data', (chunk) => {
          totalBytes += chunk.length;
        });
        
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', reject);
    });
    
    const elapsed = (Date.now() - startTime) / 1000; // in seconds
    const fileSize = fs.statSync(path.join(__dirname, 'temp_test_file')).size;
    fs.unlinkSync(path.join(__dirname, 'temp_test_file'));
    
    const speed = (fileSize * 8 / elapsed) / 1e6; // Mbps
    console.log(`⬇️ Approximate Download: ${speed.toFixed(2)} Mbps`);
    
    fs.writeFileSync(outputFile, `${speed.toFixed(2)} 0`); // 0 for upload since we can't measure
    
    if (speed < MIN_REQUIRED_SPEED) {
      console.warn(`⚠️  Warning: Speed below recommended minimum of ${MIN_REQUIRED_SPEED} Mbps`);
    }
    
    return true;
  } catch (error) {
    console.error("❌ All speed test methods failed:", error.message);
    return false;
  }
}

// Main execution
runSpeedtest().then(success => {
  if (!success) {
    console.error("❌ Could not complete speed test. Check your internet connection.");
    process.exit(1);
  }
}).catch(error => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
