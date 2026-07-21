import Conf from 'conf';
import { input, password } from '@inquirer/prompts';

interface ConfigSchema {
  token?: string;
  baseUrl: string;
}

const config = new Conf<ConfigSchema>({
  projectName: 'murl',
  schema: {
    token: {
      type: 'string',
    },
    baseUrl: {
      type: 'string',
    },
  },
});

export function getConfig() {
  return {
    token: config.get('token'),
    baseUrl: config.get('baseUrl'),
  };
}

export function hasConfig(): boolean {
  return config.has('baseUrl') && !!config.get('baseUrl');
}

export function getConfigPath(): string {
  return config.path;
}

function maskToken(token: string): string {
  if (token.length <= 4) {
    return '*'.repeat(token.length);
  }
  return `${'*'.repeat(token.length - 4)}${token.slice(-4)}`;
}

export function printConfig(): void {
  const path = getConfigPath();

  if (!hasConfig()) {
    console.log(`No configuration found at: ${path}`);
    return;
  }

  const { token, baseUrl } = getConfig();

  console.log('\n--- murl configuration ---\n');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`API token: ${token ? maskToken(token) : '(not set)'}`);
  console.log(`\nConfig file: ${path}`);
}

export async function runConfigWizard() {
  console.log('\n--- murl configuration ---\n');

  const token = await password({
    message: 'Enter your API token (leave blank if your instance has no auth, or to keep the current one):',
  });

  const baseUrl = await input({
    message: 'Enter base URL (e.g., https://api.murl.sh):',
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return 'Invalid URL format';
      }
    },
  });

  const trimmedToken = token.trim();
  if (trimmedToken) {
    config.set('token', trimmedToken);
  }
  config.set('baseUrl', baseUrl);

  console.log(`\n✓ Configuration saved to: ${config.path}`);
}

if (import.meta.main) {
  await runConfigWizard();
}
