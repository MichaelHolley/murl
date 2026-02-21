import Conf from 'conf';
import { input, password } from '@inquirer/prompts';

interface ConfigSchema {
  token: string;
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
  return (
    config.has('token') && !!config.get('token') && config.has('baseUrl') && !!config.get('baseUrl')
  );
}

export function getConfigPath(): string {
  return config.path;
}

export async function runConfigWizard() {
  console.log('\n--- murl configuration ---\n');

  const token = await password({
    message: 'Enter your API token:',
    validate: (value) => (value.length > 0 ? true : 'Token is required'),
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

  config.set('token', token);
  config.set('baseUrl', baseUrl);

  console.log(`\n✓ Configuration saved to: ${config.path}`);
}
