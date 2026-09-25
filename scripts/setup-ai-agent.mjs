#!/usr/bin/env node
/**
 * Interactive / CLI helper to configure coding agents with FreeLLMAPI for Saarthi
 * Usage:
 *   node scripts/setup-ai-agent.mjs --tool claude
 *   node scripts/setup-ai-agent.mjs --tool cursor
 *   node scripts/setup-ai-agent.mjs --doctor
 */

import { execSync } from 'child_process';
import process from 'process';

const args = process.argv.slice(2);
const toolArgIndex = args.indexOf('--tool');
const tool = toolArgIndex !== -1 ? args[toolArgIndex + 1] : null;
const isDoctor = args.includes('--doctor');

const gatewayUrl = process.env.FREELLMAPI_URL || 'http://localhost:3001';
const apiKey = process.env.FREELLMAPI_API_KEY || '';

console.log('🤖 Saarthi AI Agent Configuration Helper (FreeLLMAPI)');
console.log(`🌐 Gateway Target: ${gatewayUrl}`);

if (isDoctor) {
  try {
    console.log('\n🔍 Probing gateway health...');
    execSync(`npx --yes freellmapi doctor --url ${gatewayUrl}`, { stdio: 'inherit' });
  } catch {
    console.error('\n⚠️ FreeLLMAPI server is not currently reachable at ' + gatewayUrl);
    console.log('💡 Start FreeLLMAPI via the Windows app or Docker first: see .agents/FREELLMAPI_TOOLING.md');
  }
  process.exit(0);
}

if (!tool) {
  console.log('\nUsage:');
  console.log('  node scripts/setup-ai-agent.mjs --tool <claude|cursor|aider|codex|cline|continue>');
  console.log('  node scripts/setup-ai-agent.mjs --doctor');
  console.log('\nAvailable tools:');
  try {
    execSync('npx --yes freellmapi list', { stdio: 'inherit' });
  } catch {}
  process.exit(0);
}

const commandMap = {
  claude: 'setup-claude',
  cursor: 'setup-cursor',
  aider: 'setup-aider',
  codex: 'setup-codex',
  cline: 'setup-cline',
  continue: 'setup-continue',
  roo: 'setup-roo',
  opencode: 'setup-opencode'
};

const subCommand = commandMap[tool.toLowerCase()];
if (!subCommand) {
  console.error(`❌ Unknown tool: "${tool}". Supported: ${Object.keys(commandMap).join(', ')}`);
  process.exit(1);
}

const keyFlag = apiKey ? `--api-key "${apiKey}"` : '';
const cmd = `npx --yes freellmapi ${subCommand} --url "${gatewayUrl}" ${keyFlag}`.trim();

console.log(`\n⚙️ Running: ${cmd}`);
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log(`\n✅ Setup for ${tool} complete!`);
} catch {
  console.log(`\n💡 Note: Make sure FreeLLMAPI is running at ${gatewayUrl} before running setup.`);
  console.log('Refer to .agents/FREELLMAPI_TOOLING.md for complete details.');
}
