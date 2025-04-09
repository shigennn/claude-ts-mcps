/**
 * Notion APIを利用したModel Context Protocol(MCP)サーバーの実装
 * NotionワークスペースへのアクセスとページやデータベースのAPIを提供する
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

// Notion APIクライアントのインポート
import { Client } from "@notionhq/client"

// モジュールのインポート
import { 
  getPage, 
  createPage, 
  updatePage, 
  appendBlocks 
} from "./notion-pages"

import { 
  listDatabases, 
  getDatabase, 
  queryDatabase, 
  searchContent 
} from "./notion-database"

/**
 * MCPサーバーの初期化
 * サーバー名、バージョンを定義
 */
const server = new McpServer({
  name: "notion-mcp",
  version: "0.1.0",
})

/**
 * APIキーの確認
 * 環境変数からNotion APIキーを取得し、存在しない場合はエラーを表示して終了
 */
const NOTION_API_KEY = process.env.NOTION_API_KEY!
if (!NOTION_API_KEY) {
  console.error("Error: NOTION_API_KEY environment variable is required")
  process.exit(1)
}

// Notionクライアントの初期化
const notion = new Client({ auth: NOTION_API_KEY })

/**
 * ページ取得ツール
 * 指定されたIDのNotionページを取得し、メタデータとコンテンツを返す
 */
server.tool(
  "notion_get_page",
  "Retrieves a page from Notion by its ID",
  {
    page_id: z.string().describe("Notion page ID")
  },
  async (args) => {
    try {
      const result = await getPage(notion, args.page_id)
      return {
        content: result.content,
        isError: result.isError
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      }
    }
  }
)

/**
 * ページ作成ツール
 * 指定された親ページまたはデータベース内に新しいページを作成する
 */
server.tool(
  "notion_create_page",
  "Creates a new page in Notion with title and content",
  {
    parent_id: z.string().describe("Parent page or database ID"),
    title: z.string().describe("Page title"),
    content: z.string().describe("Page content in text format"),
    is_database: z.boolean().optional().default(false).describe("Whether parent is a database")
  },
  async (args) => {
    try {
      const result = await createPage(notion, args.parent_id, args.title, args.content, args.is_database)
      return {
        content: result.content,
        isError: result.isError
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      }
    }
  }
)

/**
 * データベース検索ツール
 * Notionワークスペース内のデータベース一覧を取得する
 */
server.tool(
  "notion_list_databases",
  "Lists all databases in the Notion workspace",
  {},
  async () => {
    try {
      const result = await listDatabases(notion)
      return {
        content: result.content,
        isError: result.isError
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      }
    }
  }
)

/**
 * データベースクエリツール
 * 指定されたデータベースに対してクエリを実行し、結果を返す
 */
server.tool(
  "notion_query_database",
  "Queries a Notion database and returns the results",
  {
    database_id: z.string().describe("Notion database ID"),
    filter: z.record(z.any()).optional().describe("Filter criteria (optional)"),
    sorts: z.array(z.record(z.any())).optional().describe("Sort criteria (optional)")
  },
  async (args) => {
    try {
      const result = await queryDatabase(notion, args.database_id, args.filter, args.sorts)
      return {
        content: result.content,
        isError: result.isError
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      }
    }
  }
)

/**
 * ワークスペース検索ツール
 * Notionワークスペース内のコンテンツを検索する
 */
server.tool(
  "notion_search",
  "Searches content across the Notion workspace",
  {
    query: z.string().describe("Search query"),
    filter_type: z.enum(["page", "database", "all"]).optional().default("all").describe("Type to filter by")
  },
  async (args) => {
    try {
      const result = await searchContent(notion, args.query, args.filter_type)
      return {
        content: result.content,
        isError: result.isError
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      }
    }
  }
)

/**
 * データベース情報取得ツール
 * 指定されたデータベースのメタデータを取得する
 */
server.tool(
  "notion_get_database",
  "Retrieves database metadata including its properties and schema",
  {
    database_id: z.string().describe("Notion database ID")
  },
  async (args) => {
    try {
      const result = await getDatabase(notion, args.database_id)
      return {
        content: result.content,
        isError: result.isError
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      }
    }
  }
)

/**
 * ページの更新ツール
 * 既存のページのタイトルや他のプロパティを更新する
 */
server.tool(
  "notion_update_page",
  "Updates properties of an existing Notion page",
  {
    page_id: z.string().describe("Page ID to update"),
    title: z.string().optional().describe("New title (optional)"),
    properties: z.record(z.any()).optional().describe("Other properties to update")
  },
  async (args) => {
    try {
      const result = await updatePage(notion, args.page_id, args.title, args.properties)
      return {
        content: result.content,
        isError: result.isError
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      }
    }
  }
)

/**
 * ページにブロックを追加するツール
 * 既存のページに新しいテキストブロックを追加する
 */
server.tool(
  "notion_append_blocks",
  "Appends text blocks to an existing page",
  {
    block_id: z.string().describe("Page or block ID to append content to"),
    text_content: z.string().describe("Text content to add")
  },
  async (args) => {
    try {
      const result = await appendBlocks(notion, args.block_id, args.text_content)
      return {
        content: result.content,
        isError: result.isError
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      }
    }
  }
)

// サーバー起動
async function runServer() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("Notion MCP Server running on stdio")
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error)
  process.exit(1)
})
