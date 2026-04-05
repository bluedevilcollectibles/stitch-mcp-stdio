#!/usr/bin/env node

/**
 * stitch-mcp-stdio
 *
 * Stable stdio MCP server for Google Stitch (stitch.withgoogle.com).
 * Drop-in replacement for @_davideast/stitch-mcp that avoids the libuv
 * proxy crash on Windows (and anywhere else the proxy layer is flaky).
 *
 * Uses @google/stitch-sdk's StitchProxy class with a stdio transport
 * instead of spawning a proxy subprocess.
 *
 * Auth: Set STITCH_API_KEY environment variable.
 *
 * Usage in .mcp.json:
 *   {
 *     "mcpServers": {
 *       "stitch": {
 *         "command": "node",
 *         "args": ["path/to/stitch-mcp-stdio/server.js"],
 *         "env": { "STITCH_API_KEY": "your-key" }
 *       }
 *     }
 *   }
 */

import { StitchProxy } from "@google/stitch-sdk";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const apiKey = process.env.STITCH_API_KEY;
if (!apiKey) {
  process.stderr.write(
    "ERROR: STITCH_API_KEY environment variable is required.\n" +
      "Get your key from stitch.withgoogle.com -> Profile -> Settings -> API Key\n"
  );
  process.exit(1);
}

const proxy = new StitchProxy({ apiKey });
const transport = new StdioServerTransport();

// Clean shutdown on signals
function shutdown() {
  proxy.close().catch(() => {}).finally(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

try {
  await proxy.start(transport);
} catch (err) {
  process.stderr.write(`Failed to start Stitch MCP server: ${err.message}\n`);
  process.exit(1);
}
