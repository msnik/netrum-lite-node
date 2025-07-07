#!/usr/bin/env node
import readline from 'readline';
import chalk from 'chalk';

// Create colorful loading animation
async function showLoadingAnimation() {
  process.stdout.write(chalk.blue('⏳  Connecting to Server Endpoint... '));

  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const colors = ['#FF5733', '#FFC300', '#DAF7A6', '#33FF57', '#33FFF5', '#3385FF', '#8A33FF', '#FF33F5', '#FF3385', '#FF5733'];
  
  const start = Date.now();
  const duration = 10000; // 10 seconds
  let i = 0;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Get current frame with color
      const frame = frames[i % frames.length];
      const color = colors[i % colors.length];
      
      // Move cursor to beginning of line and clear
      readline.cursorTo(process.stdout, 0);
      
      // Write loading animation with color and progress bar
      process.stdout.write(
        chalk.blue('⏳  Connecting to Server Endpoint... ') +
        chalk.hex(color)(frame) + ' ' +
        chalk.green('[' + '█'.repeat(Math.floor(progress * 20)) + 
        ' '.repeat(20 - Math.floor(progress * 20)) + '] ') +
        chalk.yellow(`${Math.floor(progress * 100)}%`)
      );
      
      i++;
      
      if (elapsed >= duration) {
        clearInterval(interval);
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 1);
        console.log(chalk.green('✅  Connected successfully! (10.0s)'));
        resolve();
      }
    }, 100);
  });
}

// Run the animation
showLoadingAnimation().catch(console.error);
