/**
 * Notion API ページ関連機能
 * ページの取得、作成、更新、ブロック操作などの機能を提供
 */

import { Client } from "@notionhq/client"
import { createSuccessResponse, createErrorResponse } from "./notion-utils"
import { markdownToBlocks } from "./notion-blocks"

/**
 * 指定されたIDのNotionページを取得する
 * 
 * @param notion Notionクライアントインスタンス
 * @param page_id 取得するページのID
 * @returns MCP応答
 */
export async function getPage(notion: Client, page_id: string) {
  try {
    // ページメタデータを取得
    const page = await notion.pages.retrieve({ page_id })
    
    // ページコンテンツ（ブロック）を取得
    const blocks = await notion.blocks.children.list({ 
      block_id: page_id,
      page_size: 100
    })
    
    return createSuccessResponse(JSON.stringify({ page, blocks }, null, 2))
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 新しいNotionページを作成する
 * 
 * @param notion Notionクライアントインスタンス
 * @param parent_id 親ページまたはデータベースのID
 * @param title ページのタイトル
 * @param content ページのコンテンツ（マークダウン形式対応）
 * @param is_database 親がデータベースかどうか（デフォルトはfalse）
 * @returns MCP応答
 */
export async function createPage(
  notion: Client,
  parent_id: string,
  title: string,
  content: string,
  is_database: boolean = false
) {
  try {
    // 親指定（データベースまたはページ）
    const parent = is_database 
      ? { database_id: parent_id }
      : { page_id: parent_id }
    
    // コンテンツをMarkdownとして解析し、Notionブロックに変換
    const children = await markdownToBlocks(content)
    
    // ページ作成
    const newPage = await notion.pages.create({
      parent,
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
      children
    })
    
    return createSuccessResponse(`Page created successfully with ID: ${newPage.id}`)
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 既存のNotionページのプロパティを更新する
 * 
 * @param notion Notionクライアントインスタンス
 * @param page_id 更新するページのID
 * @param title 新しいタイトル（オプション）
 * @param properties その他のプロパティ（オプション）
 * @returns MCP応答
 */
export async function updatePage(
  notion: Client,
  page_id: string,
  title?: string,
  properties?: Record<string, any>
) {
  try {
    // 更新用のプロパティオブジェクトを作成
    const updateProps: Record<string, any> = { ...properties || {} }
    
    // タイトルが指定されていれば追加
    if (title) {
      updateProps.title = {
        title: [
          {
            text: {
              content: title
            }
          }
        ]
      }
    }
    
    // ページを更新
    const updatedPage = await notion.pages.update({
      page_id,
      properties: updateProps
    })
    
    return createSuccessResponse(`Page updated successfully: ${JSON.stringify(updatedPage.id, null, 2)}`)
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 既存のページまたはブロックに新しいブロックを追加する
 * 
 * @param notion Notionクライアントインスタンス
 * @param block_id ブロックを追加する対象のページまたはブロックID
 * @param text_content 追加するテキストコンテンツ（マークダウン形式対応）
 * @returns MCP応答
 */
export async function appendBlocks(
  notion: Client,
  block_id: string,
  text_content: string
) {
  try {
    // テキストをマークダウンとして解析し、Notionブロックに変換
    const children = await markdownToBlocks(text_content)
    
    // ブロックを追加
    const response = await notion.blocks.children.append({
      block_id,
      children
    })
    
    return createSuccessResponse(`Content appended successfully: ${JSON.stringify(response, null, 2)}`)
  } catch (error) {
    return createErrorResponse(error)
  }
}
