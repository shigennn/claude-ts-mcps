/**
 * Notion API データベース関連機能
 * データベースの取得、検索、クエリなどの機能を提供
 */

import { Client } from "@notionhq/client"
import { createSuccessResponse, createErrorResponse } from "./notion-utils"

/**
 * Notionワークスペース内のデータベース一覧を取得する
 * 
 * @param notion Notionクライアントインスタンス
 * @returns MCP応答
 */
export async function listDatabases(notion: Client) {
  try {
    const response = await notion.search({
      filter: {
        property: "object" as const,
        value: "database"
      }
    })
    
    return createSuccessResponse(JSON.stringify(response.results, null, 2))
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 指定されたデータベースの詳細情報（スキーマなど）を取得する
 * 
 * @param notion Notionクライアントインスタンス
 * @param database_id 取得するデータベースのID
 * @returns MCP応答
 */
export async function getDatabase(notion: Client, database_id: string) {
  try {
    const database = await notion.databases.retrieve({ 
      database_id 
    })
    
    return createSuccessResponse(JSON.stringify(database, null, 2))
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * データベースに対してクエリを実行し、結果を返す
 * 
 * @param notion Notionクライアントインスタンス
 * @param database_id クエリするデータベースのID
 * @param filter フィルタ条件（オプション）
 * @param sorts ソート条件（オプション）
 * @returns MCP応答
 */
export async function queryDatabase(
  notion: Client,
  database_id: string,
  filter?: Record<string, any>,
  sorts?: Array<Record<string, any>>
) {
  try {
    const response = await notion.databases.query({
      database_id,
      filter: filter ? filter as any : undefined,
      sorts: sorts ? sorts as any : undefined,
    })
    
    return createSuccessResponse(JSON.stringify(response.results, null, 2))
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * Notionワークスペース内のコンテンツを検索する
 * 
 * @param notion Notionクライアントインスタンス
 * @param query 検索クエリ
 * @param filter_type フィルタタイプ（"page", "database", "all"のいずれか）
 * @returns MCP応答
 */
export async function searchContent(
  notion: Client,
  query: string,
  filter_type: "page" | "database" | "all" = "all"
) {
  try {
    // フィルターの設定
    const searchFilter = filter_type !== "all" ? {
      property: "object" as const,
      value: filter_type
    } : undefined;
    
    const response = await notion.search({
      query,
      filter: searchFilter
    })
    
    return createSuccessResponse(JSON.stringify(response.results, null, 2))
  } catch (error) {
    return createErrorResponse(error)
  }
}
