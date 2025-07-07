#!/usr/bin/env node
import { execSync } from 'child_process';
import process from 'process';

console.log('\n??️  Generating signature from wallet...');

try {
  // Execute the sign-Message.js script
  execSync('node src/identity/sign-Message.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌  Failed to generate signature. Check for Node.js or ethers error.');
  process.exit(1);
}
