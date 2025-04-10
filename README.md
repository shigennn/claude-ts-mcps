# Claude Desktop MCP Servers

A collection of Model Context Protocol (MCP) servers designed to enhance Claude Desktop with various integrations and capabilities. This project leverages the Claude Pro subscription by enabling Claude AI to interact with external services and APIs through the Model Context Protocol.

## Overview

This project implements several MCP servers that significantly expand Claude Desktop's functionality:

- **Brave Search**: Web search and local search functionality using the Brave Search API
- **Filesystem**: File system operations with security restrictions
- **Git**: Git repository management functionality
- **GitHub**: GitHub API integration for repositories, issues, pull requests, and more
- **Shell**: Shell command execution in a controlled environment
- **Figma**: Integration with Figma API for design files
- **Slack**: Slack API integration for messaging and channel information
- **Firecrawl**: Web scraping capabilities
- **Notion**: Notion API integration with markdown conversion for improved readability

## Requirements

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) as the JavaScript/TypeScript runtime
- [Claude Desktop](https://anthropic.com/claude) application

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/claude-ts-mcps.git
   cd claude-ts-mcps
   ```

2. Install dependencies:
   ```
   bun install
   ```

## Configuration

To use these MCP servers with Claude Desktop, you need to create a configuration file that tells Claude how to connect to them. Here's a complete example based on the actual implementation:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\brave-search.ts"
      ],
      "env": {
        "BRAVE_API_KEY": "YOUR_BRAVE_API_KEY"
      }
    },
    "filesystem": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\filesystem.ts",
        "C:\\Users\\username"
      ]
    },
    "git": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\git.ts"
      ]
    },
    "github": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\github.ts"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
      }
    },
    "shell": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\shell.ts"
      ]
    },
    "figma": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\figma.ts"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "YOUR_FIGMA_TOKEN"
      }
    },
    "slack": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\slack.ts"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "YOUR_SLACK_BOT_TOKEN",
        "SLACK_TEAM_ID": "YOUR_SLACK_TEAM_ID"
      }
    },
    "firecrawl": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\firecrawl.ts"
      ],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_FIRECRAWL_API_KEY"
      }
    },
    "notion": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\notion.ts"
      ],
      "env": {
        "NOTION_API_KEY": "YOUR_NOTION_API_KEY"
      }
    }
  }
}
```

Save this configuration file in the appropriate location:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

### API Keys and Tokens Setup

For each service integration, you'll need to obtain and configure the appropriate API keys:

1. **Brave Search API**: Sign up at [Brave Search API](https://brave.com/search/api/) to get your API key
2. **GitHub**: Create a [personal access token](https://github.com/settings/tokens) with appropriate permissions
3. **Figma**: Generate an [access token](https://www.figma.com/developers/api#access-tokens) in your Figma account
4. **Slack**: Create a [Slack app](https://api.slack.com/apps) and generate a bot token
5. **Firecrawl**: Sign up for a Firecrawl API key
6. **Notion**: Create an [integration](https://www.notion.so/my-integrations) and get the API key

Replace the placeholder values in the configuration file with your actual API keys and tokens.

## Usage

1. Start Claude Desktop
2. The MCP servers will automatically connect
3. Claude will now have access to all the integrated services during your conversations

## Feature Details

### Notion Integration

The Notion integration provides:

- Creation, retrieval, updating, and deletion of pages, databases, and blocks
- Search functionality
- Markdown conversion for improved readability
- Database querying capabilities
- Comment functionality

### GitHub Integration

The GitHub integration enables:

- Repository creation, search, and management
- File retrieval, updating, and committing
- Issue and pull request management
- Multiple account support

### File System

Securely access the file system with:

- File reading and writing operations
- Directory operations
- File search capabilities
- File metadata retrieval

### Additional Integrations

- **Brave Search**: Web and local search capabilities
- **Git**: Repository management, commits, branch operations
- **Shell**: Controlled shell command execution
- **Figma**: Design file retrieval and operations
- **Slack**: Message sending and channel information retrieval

## Development

Each MCP server is implemented as a standalone TypeScript file or directory in the `src` folder:

- `src/brave-search.ts`: Brave Search API integration
- `src/filesystem.ts`: File system operations
- `src/git.ts`: Git operations
- `src/github.ts` & `src/github/`: GitHub API integration
- `src/shell.ts`: Shell command execution
- `src/figma.ts`: Figma API integration
- `src/slack.ts`: Slack API integration
- `src/firecrawl.ts`: Web scraping
- `src/notion.ts` & `src/notion/`: Notion API integration

To add new functionality:

1. Create a new TypeScript file in the `src` directory
2. Implement the MCP server using the `@modelcontextprotocol/sdk`
3. Add the new server to your Claude Desktop configuration

## Security Considerations

- The filesystem and shell servers include security measures to prevent unauthorized access
- Always validate user input before executing commands
- Be cautious when configuring allowed directories for filesystem access
- Use the command allowlist for the shell server to restrict executable commands
- Store your API keys and tokens securely and follow the principle of least privilege

## References and Acknowledgements

This project is based on the following repositories:

- [ukkz/claude-ts-mcps](https://github.com/ukkz/claude-ts-mcps) - Original implementation of MCP servers collection
- [suekou/mcp-notion-server](https://github.com/suekou/mcp-notion-server) - Reference implementation for Notion MCP server

Additional references:

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Server Quickstart](https://modelcontextprotocol.io/quickstart/server)
- [Anthropic Claude](https://www.anthropic.com/claude)

## License

[MIT License](LICENSE)
