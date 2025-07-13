#!/usr/bin/env node
import { spawn } from 'child_process';
import chalk from 'chalk';

// Help message
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
⛏️  Netrum Mining Log Viewer
Usage:
  netrum-mining-log        View live mining logs
  netrum-mining-log --help Show this help

Description:
  Displays real-time mining operation logs with:
  - Mining session status
  - Earned NPT tokens
  - Current mining speed
  - Time remaining
  - System health metrics

Features:
  ${chalk.green('✓')} Color-coded status indicators
  ${chalk.green('✓')} Filtered relevant mining messages
  ${chalk.green('✓')} Real-time updates (2 sec refresh)
  ${chalk.green('✓')} Critical error highlighting

View raw logs: journalctl -u netrum-mining.service -f
`);
  process.exit(0);
}

// Custom log formatter
function formatLog(line) {
  // Mining status updates
  if (line.includes('MINING STATUS')) {
    const parts = line.split('|');
    return chalk.cyan(`⏱️  ${parts[1].trim()}`);
  }

  // Transaction events
  if (line.includes('TX submitted')) {
    return chalk.green(`✅ ${line.split(']').pop().trim()}`);
  }

  // Errors
  if (line.includes('ERROR') || line.includes('Error:')) {
    return chalk.red(`❌ ${line.split(']').pop().trim()}`);
  }

  // Session events
  if (line.includes('session')) {
    return chalk.yellow(`?? ${line.split(']').pop().trim()}`);
  }

  // Default formatting
  return `?? ${line.split(']').pop().trim()}`;
}

// Run journalctl with filters
const journalctl = spawn('journalctl', [
  '-u', 'netrum-mining.service',
  '-f', // follow mode
  '-n', '50', // initial lines
  '--no-pager',
  '-o', 'cat' // simple output
]);

// Header
console.log(chalk.bold.magenta('\n⛏️  Netrum Mining Live Logs\n'));
console.log(chalk.dim('Press Ctrl+C to exit\n'));

// Process output
journalctl.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim().length > 0) {
      console.log(formatLog(line));
    }
  });
});

journalctl.stderr.on('data', (data) => {
  console.error(chalk.red('⚠️  Log Error:'), data.toString());
});

journalctl.on('close', (code) => {
  console.log(chalk.dim('\nLog viewer exited'));
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  journalctl.kill();
  process.exit(0);
});
