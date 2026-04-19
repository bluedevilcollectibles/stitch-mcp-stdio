# stitch-mcp-stdio

Stable stdio MCP server for [Google Stitch](https://stitch.withgoogle.com) AI UI design tool.

Drop-in replacement for `@_davideast/stitch-mcp` that eliminates the proxy layer crash (libuv `UV_HANDLE_CLOSING` assertion failure on Windows and intermittent connection drops on other platforms).

## Why this exists

The official `@_davideast/stitch-mcp` package runs a proxy subprocess that suffers from a [libuv bug](https://github.com/libuv/libuv/issues) causing random crashes, especially on Windows. This package uses the same `@google/stitch-sdk` under the hood but connects via stdio transport directly -- no proxy process, no crash.

## Setup

### 1. Get a Stitch API key

Go to [stitch.withgoogle.com](https://stitch.withgoogle.com) -> Profile -> Settings -> API Key.

### 2. Configure your MCP client

Point any MCP-compatible client (Claude Code, Claude Desktop, Cursor, Gemini CLI, VS Code) at `npx stitch-mcp-stdio`:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "stitch-mcp-stdio"],
      "env": {
        "STITCH_API_KEY": "your-api-key"
      }
    }
  }
}
```

`npx -y` downloads + runs the latest version without a permanent install. To pin a version use `stitch-mcp-stdio@1.0.0`.

### Alternative: local clone (if you'd rather not use npx)

```bash
git clone https://github.com/bluedevilcollectibles/stitch-mcp-stdio.git
cd stitch-mcp-stdio
npm install
```

Then point the client at `node /path/to/stitch-mcp-stdio/server.js` instead of `npx`.

## Available tools

All 12 tools from the Stitch SDK are exposed:

| Tool | Description |
|------|-------------|
| `create_project` | Create a new Stitch project |
| `get_project` | Get project details |
| `list_projects` | List all projects |
| `list_screens` | List screens in a project |
| `get_screen` | Get screen details |
| `generate_screen_from_text` | Generate a screen from a text prompt |
| `edit_screens` | Edit an existing screen |
| `generate_variants` | Generate design variants |
| `create_design_system` | Create a design system |
| `update_design_system` | Update a design system |
| `list_design_systems` | List design systems |
| `apply_design_system` | Apply a design system to screens |

## How it works

```
MCP Client (Claude, Cursor, etc.)
    |
    | stdio (stdin/stdout)
    |
stitch-mcp-stdio (this package)
    |
    | HTTPS (API key auth)
    |
stitch.googleapis.com/mcp
```

No proxy subprocess. No libuv handle management. Just stdio in, API calls out.

## Built by

[Blue Devil Collectibles](https://bluedevilcollectibles.com) -- makers of [LiveSeller Pro](https://livesellerpro.app), inventory and live selling tools for comic shops, card shops, and collectibles dealers.

We built this MCP server to power our AI design pipeline. If you sell on WhatNot, manage pull lists, or run a brick-and-mortar shop, check out what we're building.

## License

MIT
