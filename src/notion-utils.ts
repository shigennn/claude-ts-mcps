/**
 * Notion API MCP用のユーティリティ関数
 * 共通で使用される型や関数を定義
 */

import { Client } from "@notionhq/client"
import { MdBlock, NotionBlock } from "./notion-blocks"

/**
 * NotionのAPIレスポンスのエラーハンドリング用関数
 * エラーメッセージを統一フォーマットで返す
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

/**
 * MCP応答用のレスポンスを成功時のフォーマットで生成
 */
export function createSuccessResponse(content: string): { content: Array<{ type: string, text: string }>, isError: boolean } {
  return {
    content: [{ 
      type: "text", 
      text: content
    }],
    isError: false,
  }
}

/**
 * MCP応答用のレスポンスをエラー時のフォーマットで生成
 */
export function createErrorResponse(error: unknown): { content: Array<{ type: string, text: string }>, isError: boolean } {
  return {
    content: [
      {
        type: "text",
        text: `Error: ${formatErrorMessage(error)}`,
      },
    ],
    isError: true,
  }
}

/**
 * Markdownのコードブロックを検出して言語を抽出する関数
 * @param text コードブロックを含む可能性のあるテキスト
 * @returns 言語情報（指定がない場合は"plain"）
 */
export function detectCodeBlockLanguage(text: string): string {
  // ```の後の言語名を取得
  const match = text.trim().match(/^```([a-zA-Z0-9_+-]+)/)
  return match ? match[1] : "plain text"
}

/**
 * ブロックIDの型チェック
 * NotionのブロックIDは有効なUUIDフォーマットである必要がある
 */
export function isValidBlockId(id: string): boolean {
  // UUIDの簡易バリデーション（完全ではない）
  const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i
  return uuidRegex.test(id.replace(/-/g, ''))
}

/**
 * Notionのリッチテキストオブジェクトをシンプルなテキストへ変換
 * @param richText Notionのリッチテキスト配列
 * @returns プレーンテキスト
 */
export function richTextToPlainText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) {
    return ''
  }
  return richText.map(text => text.plain_text || '').join('')
}

/**
 * シンプルなテキストをNotionのリッチテキスト形式に変換
 * @param text 変換するテキスト
 * @returns Notionリッチテキストオブジェクト
 */
export function textToRichText(text: string): any[] {
  return [
    {
      type: "text",
      text: {
        content: text,
      },
    },
  ]
}
