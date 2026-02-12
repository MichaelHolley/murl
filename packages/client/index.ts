#!/usr/bin/env bun

const API_TOKEN = process.env.API_TOKEN;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

if (!API_TOKEN) {
  console.error("Error: API_TOKEN environment variable is required");
  console.error("Please set API_TOKEN in your environment or .env file");
  process.exit(1);
}

async function shortenUrl(url: string): Promise<void> {
  try {
    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      console.error(`Error: Invalid URL format: ${url}`);
      process.exit(1);
    }

    // Call the backend API
    const response = await fetch(`${BASE_URL}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Error: Failed to shorten URL - ${error}`);
      process.exit(1);
    }

    const data = await response.json();
    console.log(data.shortUrl);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Error: An unexpected error occurred");
    }
    process.exit(1);
  }
}

// Main CLI logic
const args = process.argv.slice(2);

if (args.length === 0 || !args[0]) {
  console.error("Usage: murl <url>");
  console.error("Example: murl https://example.com");
  process.exit(1);
}

if (args.length > 1) {
  console.error("Error: Too many arguments. Please provide a single URL.");
  console.error("Usage: murl <url>");
  process.exit(1);
}

const url = args[0];

await shortenUrl(url);
