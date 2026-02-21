#!/usr/bin/env bun

import { getConfig, hasConfig, runConfigWizard } from './config';

async function shortenUrl(url: string): Promise<void> {
  if (!hasConfig()) {
    await runConfigWizard();
  }

  const { token: API_TOKEN, baseUrl: BASE_URL } = getConfig();

  try {
    // Validate URL format
    try {
      new URL(url);
    } catch {
      console.error(`Error: Invalid URL format: ${url}`);
      process.exit(1);
    }

    // Call the backend API
    const response = await fetch(`${BASE_URL}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Error: Failed to shorten URL - ${JSON.stringify(error)}`);
      process.exit(1);
    }

    const data = (await response.json()) as { shortUrl: string };
    console.log(data.shortUrl);
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error: An unexpected error occurred');
    }
    process.exit(1);
  }
}

// Main CLI logic
const args = process.argv.slice(2);

if (args[0] === 'config') {
  await runConfigWizard();
  process.exit(0);
}

if (args.length === 0 || !args[0]) {
  console.log('Usage:');
  console.log('  murl "<url>"    Shorten a URL (use quotes for URLs with special characters)');
  console.log('  murl config     Configure API token and base URL');
  process.exit(1);
}

if (args.length > 1) {
  console.error("Error: Too many arguments. Please provide a single URL or 'config'.");
  process.exit(1);
}

const url = args[0];
await shortenUrl(url);
