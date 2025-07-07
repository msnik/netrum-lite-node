#!/usr/bin/env node
import { execSync } from 'child_process';

console.log("?? Checking System Requirements...");

try {
  // Get RAM in GB
  const ram = parseInt(execSync("free -g | awk '/^Mem:/{print $2}'").toString().trim());
  
  // Get Disk space in GB (remove 'G' suffix)
  const disk = parseInt(execSync("df -h / | awk 'NR==2 {print $2}' | sed 's/G//'").toString().trim());
  
  // Get CPU cores
  const cpu = parseInt(execSync("nproc").toString().trim());
  
  console.log(`?? RAM: ${ram} GB`);
  console.log(`?? DISK: ${disk} GB`);
  console.log(`?? CPU Cores: ${cpu}`);
  
  // Check requirements
  const MIN_RAM = 4;
  const MIN_DISK = 50;
  
  if (ram < MIN_RAM) {
    console.log(`❌ RAM requirement not met (Minimum ${MIN_RAM}GB)`);
    process.exit(1);
  }
  
  if (disk < MIN_DISK) {
    console.log(`❌ Disk space requirement not met (Minimum ${MIN_DISK}GB)`);
    process.exit(1);
  }
  
  console.log("✅ System meets requirements.");
} catch (error) {
  console.error("❌ Error checking system requirements:", error.message);
  process.exit(1);
}
