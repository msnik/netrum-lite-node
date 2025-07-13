#!/usr/bin/env node
import { spawn } from 'child_process';

// Check for --help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
?? Netrum Sync Log Viewer

Usage:
  netrum-sync-log       View live sync logs
  netrum-sync-log --help  Show this help

Description:
  Displays real-time synchronization logs from your Netrum node.
  Shows connection status, sync intervals, and any errors.
  
  This connects to systemd's journalctl to show:
  - Sync success/failure messages
  - Node status updates
  - System health metrics
`);
  process.exit(0);
}

// Run journalctl to view netrum-node.service logs
const journalctl = spawn('journalctl', [
  '-u', 'netrum-node.service',
  '-f',  // follow mode
  '-n', '100',  // show last 100 lines initially
  '--no-pager'  // don't use a pager
]);

// Pipe output to console
journalctl.stdout.pipe(process.stdout);
journalctl.stderr.pipe(process.stderr);

// Handle exit
journalctl.on('close', (code) => {
  process.exit(code);
});
