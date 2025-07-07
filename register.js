#!/usr/bin/env node
import { spawn } from 'child_process';
import fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import gradient from 'gradient-string';
import figlet from 'figlet';

// Orange theme configuration
const orange = chalk.hex('#FFA500');
const darkOrange = chalk.hex('#FF8C00');
const orangeGradient = gradient('orange', 'darkorange');
const successGreen = chalk.green.bold;
const errorRed = chalk.red.bold;

// Custom orange spinner
const orangeSpinner = {
  interval: 80,
  frames: ["🔸 ", "🟠 ", "🔶 ", "🟡 "]
};

function showHeader() {
  console.clear();
  console.log(
    orangeGradient(
      figlet.textSync('Netrum Node', { horizontalLayout: 'full' })
    )
  );
  console.log(
    boxen(orange.bold('🚀 Node Registration Portal'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'yellow'
    })
  );
}

async function executeStep(stepName, command) {
  const spinner = ora({
    text: orange(`Running ${stepName}...`),
    spinner: orangeSpinner
  }).start();

  try {
    const child = spawn(command, { shell: true });
    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    const exitCode = await new Promise((resolve) => {
      child.on('close', (code) => resolve(code));
    });

    if (exitCode === 0) {
      spinner.succeed(successGreen(`${stepName} completed successfully`));
      console.log(boxen(output.trim(), { padding: 1, borderColor: 'green' }));
      return true;
    } else {
      spinner.fail(errorRed(`${stepName} failed`));
      console.log(boxen(errorOutput.trim() || output.trim(), { 
        padding: 1, 
        borderColor: 'red',
        backgroundColor: '#300'
      }));
      return false;
    }
  } catch (error) {
    spinner.fail(errorRed(`${stepName} error`));
    console.log(boxen(error.message, { 
      padding: 1, 
      borderColor: 'red',
      backgroundColor: '#300'
    }));
    return false;
  }
}

async function registerNode() {
  showHeader();
  let NODE_WALLET, NODE_ID; // Declare variables at function scope

  try {
    // Step 1: System check
    console.log(orange.bold('\n🔍 Step 1: System Requirements Check'));
    if (!await executeStep('System Check', 'node src/system/system.js')) {
      process.exit(1);
    }

    // Step 2: Wallet initialization
    console.log(orange.bold('\n🔐 Step 2: Wallet Initialization'));
    if (!await executeStep('Wallet Init', 'node setup.js')) {
      process.exit(1);
    }

    // Read wallet info
    const walletSpinner = ora(orange('Reading wallet information...')).start();
    try {
      const WALLET_FILE = "data/wallet/key.txt";

      if (fs.existsSync(WALLET_FILE)) {
        const content = fs.readFileSync(WALLET_FILE, 'utf8');
        NODE_WALLET = content.includes('address') 
          ? JSON.parse(content).address 
          : (await import('ethers')).Wallet.createRandom().address;
        NODE_ID = fs.readFileSync('data/node/id.txt', 'utf8');
        walletSpinner.succeed(darkOrange.bold(`Wallet: ${orange.bold(NODE_WALLET)}\nNode ID: ${orange.bold(NODE_ID)}`));
      } else {
        throw new Error('Wallet file not found at ' + WALLET_FILE);
      }
    } catch (error) {
      walletSpinner.fail(errorRed('Wallet read failed'));
      console.log(boxen(error.message, { padding: 1, borderColor: 'red' }));
      process.exit(1);
    }

    // Step 3: Balance check
    console.log(orange.bold('\n💸 Step 3: Wallet Balance Check'));
    if (!await executeStep('Balance Check', 'node src/wallet/balance-checker.js')) {
      process.exit(1);
    }

    // Step 4: Network connection
    console.log(orange.bold('\n🌐 Step 4: Network Connection'));
    if (!await executeStep('Network Connect', 'node src/system/connecting.js')) {
      process.exit(1);
    }

    // Step 5: Contract registration
    console.log(orange.bold('\n📝 Step 5: Contract Registration'));
    if (!await executeStep('Contract Register', 'node src/contracts/lite-register.js')) {
      process.exit(1);
    }

    // Step 6: API registration
    console.log(orange.bold('\n📡 Step 6: API Registration'));
    if (!await executeStep('API Register', 'node src/server/api-register.js')) {
      process.exit(1);
    }

    // Final success message
    console.log(
      boxen(
        orangeGradient('🎉 Node Registration Complete!'),
        { padding: 1, borderColor: 'yellow' }
      )
    );
    console.log(orange.bold('\nNode Registration Details:'));
    console.log(orange(`🔶 Wallet: ${darkOrange.bold(NODE_WALLET)}`));
    console.log(orange(`🔶 Node ID: ${darkOrange.bold(NODE_ID)}\n`));

  } catch (error) {
    console.error(errorRed('\n❌ Critical Registration Error:'));
    console.log(boxen(error.message, { padding: 1, borderColor: 'red' }));
    process.exit(1);
  }
}

registerNode();
