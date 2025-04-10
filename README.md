# Claude Desktop MCP サーバー集

Claude Desktop アプリケーションと Model Context Protocol (MCP) を活用して、様々な外部サービスとの連携を実現するためのサーバー集です。このプロジェクトは、Claude Pro のサブスクリプションを最大限に活用し、Claude AIに追加の機能を提供します。

## 概要

このプロジェクトでは、以下のようなMCPサーバーを実装しています：

- **Brave Search**: Web検索と位置情報検索機能を提供（Brave Search API使用）
- **Filesystem**: ファイルシステム操作（セキュリティ制限付き）
- **Git**: Gitリポジトリ管理機能
- **GitHub**: GitHub APIとの連携（リポジトリ、Issue、PRなど）
- **Shell**: シェルコマンド実行環境
- **Figma**: FigmaのAPIとの連携
- **Slack**: Slack APIとの連携
- **Firecrawl**: Webスクレイピング機能
- **Notion**: Notion APIとの連携（マークダウン変換機能付き）

## 要件

- [Node.js](https://nodejs.org/) (v18以上)
- [Bun](https://bun.sh/) (JavaScript/TypeScriptランタイム)
- [Claude Desktop](https://anthropic.com/claude) アプリケーション

## インストール方法

1. リポジトリをクローン：
   ```
   git clone https://github.com/yourname/claude-ts-mcps.git
   cd claude-ts-mcps
   ```

2. 依存関係のインストール：
   ```
   bun install
   ```

## 設定方法

Claude Desktopでこれらのサーバーを使用するには、設定ファイルを作成してClaude Desktopに読み込ませる必要があります。以下は設定例です：

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
    "notion": {
      "command": "C:\\Users\\username\\.bun\\bin\\bun.exe",
      "args": [
        "run",
        "C:\\Users\\username\\Documents\\claude-ts-mcps\\src\\notion.ts"
      ],
      "env": {
        "NOTION_API_KEY": "YOUR_NOTION_TOKEN"
      }
    }
  }
}
```

この設定ファイルを `%APPDATA%\Claude\claude_desktop_config.json`（Windowsの場合）または `~/Library/Application Support/Claude/claude_desktop_config.json`（Macの場合）に保存してください。

## 使用方法

1. Claude Desktopを起動
2. MCPサーバーが自動的に接続されます
3. チャット中に各種外部サービスとの連携機能が利用可能になります

## 機能詳細

### Notion連携

Notion APIと連携し、以下の機能を提供します：

- ページ、データベース、ブロックの取得・作成・更新・削除
- 検索機能
- マークダウン変換機能（読みやすさ向上）
- データベースクエリ機能
- コメント機能

### GitHub連携

GitHubとの連携により、以下の操作が可能になります：

- リポジトリの作成・検索・操作
- ファイルの取得・更新・コミット
- イシューとプルリクエストの管理
- 複数アカウントのサポート

### ファイルシステム

セキュリティ制限付きでファイルシステムにアクセスできます：

- ファイルの読み書き
- ディレクトリ操作
- ファイル検索
- ファイル情報の取得

### その他の連携

- **Brave Search**: Web検索と位置情報検索
- **Git**: リポジトリ管理、コミット、ブランチ操作
- **Shell**: 制限付きシェルコマンド実行
- **Figma**: デザインファイルの取得や操作
- **Slack**: メッセージ送信やチャンネル情報取得

## 開発情報

各MCPサーバーは`src`ディレクトリ内の個別のTypeScriptファイルまたはディレクトリとして実装されています：

- `src/brave-search.ts`: Brave Search API連携
- `src/filesystem.ts`: ファイルシステム操作
- `src/git.ts`: Git操作
- `src/github.ts` & `src/github/`: GitHub API連携
- `src/shell.ts`: シェルコマンド実行
- `src/figma.ts`: Figma API連携
- `src/slack.ts`: Slack API連携
- `src/firecrawl.ts`: Webスクレイピング
- `src/notion.ts` & `src/notion/`: Notion API連携

新機能を追加するには：

1. `src`ディレクトリに新しいTypeScriptファイルを作成
2. `@modelcontextprotocol/sdk`を使用してMCPサーバーを実装
3. Claude Desktopの設定ファイルに新しいサーバーを追加

## セキュリティ考慮事項

- ファイルシステムとシェルサーバーには、不正アクセスを防ぐセキュリティ措置が含まれています
- コマンド実行前に常にユーザー入力を検証してください
- ファイルシステムアクセスの許可ディレクトリ設定には注意が必要です
- シェルサーバーでは許可コマンドリストを使用して実行可能なコマンドを制限します
- APIキーやトークンは適切に保護し、最小権限の原則に従ってください

## 参考資料と謝辞

このプロジェクトは以下のリポジトリをベースにしています：

- [ukkz/claude-ts-mcps](https://github.com/ukkz/claude-ts-mcps) - オリジナルのMCPサーバー集の実装
- [suekou/mcp-notion-server](https://github.com/suekou/mcp-notion-server) - Notion MCPサーバーの実装参考

その他の参考資料：

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Server Quickstart](https://modelcontextprotocol.io/quickstart/server)
- [Anthropic Claude](https://www.anthropic.com/claude)

## ライセンス

[MIT License](LICENSE)
