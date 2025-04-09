/**
 * Notion API ブロック変換機能
 * マークダウンをNotionブロック構造に変換する機能を提供
 */

import { textToRichText } from "./notion-utils"

/**
 * マークダウンブロックの種類を表す型
 */
export type MdBlockType = 
  | 'paragraph' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3' 
  | 'bulletedList' 
  | 'numberedList' 
  | 'codeBlock'
  | 'blockquote'
  | 'table'
  | 'divider'

// コードブロックの言語マッピング
const LANGUAGE_MAP: Record<string, string> = {
  'javascript': 'javascript',
  'js': 'javascript',
  'typescript': 'typescript',
  'ts': 'typescript',
  'python': 'python',
  'py': 'python',
  'ruby': 'ruby',
  'rb': 'ruby',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'c++': 'cpp',
  'csharp': 'csharp',
  'cs': 'csharp',
  'c#': 'csharp',
  'php': 'php',
  'go': 'go',
  'rust': 'rust',
  'swift': 'swift',
  'kotlin': 'kotlin',
  'shell': 'shell',
  'bash': 'shell',
  'sh': 'shell',
  'html': 'html',
  'css': 'css',
  'scss': 'css',
  'sass': 'css',
  'sql': 'sql',
  'json': 'json',
  'xml': 'xml',
  'yaml': 'yaml',
  'yml': 'yaml',
  'markdown': 'markdown',
  'md': 'markdown'
};

// Notionがサポートする言語リスト
const NOTION_SUPPORTED_LANGUAGES = [
  'abap', 'arduino', 'bash', 'basic', 'c', 'clojure', 'coffeescript',
  'c++', 'c#', 'css', 'dart', 'diff', 'docker', 'elixir', 'elm', 'erlang',
  'flow', 'fortran', 'f#', 'gherkin', 'glsl', 'go', 'graphql', 'groovy',
  'haskell', 'html', 'java', 'javascript', 'json', 'julia', 'kotlin', 'latex',
  'less', 'lisp', 'livescript', 'lua', 'makefile', 'markdown', 'markup', 'matlab',
  'mermaid', 'nix', 'objective-c', 'ocaml', 'pascal', 'perl', 'php', 'plain text',
  'powershell', 'prolog', 'protobuf', 'python', 'r', 'reason', 'ruby', 'rust',
  'sass', 'scala', 'scheme', 'scss', 'shell', 'sql', 'swift', 'typescript',
  'vb.net', 'verilog', 'vhdl', 'visual basic', 'webassembly', 'xml', 'yaml',
  'java/c/c++/c#'
];

// 言語名をNotionがサポートする形式に正規化する関数
function normalizeLanguage(language: string): string {
  if (!language || language.trim() === '') {
    return 'plain text';
  }
  
  // 小文字にして正規化
  const normalizedLang = language.toLowerCase().trim();
  
  // マッピングから探す
  const mappedLang = LANGUAGE_MAP[normalizedLang] || normalizedLang;
  
  // Notionがサポートする言語か確認
  if (NOTION_SUPPORTED_LANGUAGES.includes(mappedLang)) {
    return mappedLang;
  }
  
  // サポートされていない場合はプレーンテキストを返す
  return 'plain text';
}

/**
 * マークダウンブロックの基本インターフェース
 */
export interface MdBlock {
  type: MdBlockType
  content: string
  language?: string  // コードブロック用の言語
  children?: MdBlock[]  // ネストされたブロック
}

/**
 * Notion API用のブロック表現
 */
export interface NotionBlock {
  object: 'block'
  type: string
  [key: string]: any
}

/**
 * マークダウンテキストをNotionブロックに変換する関数
 * 
 * @param markdown 変換するマークダウンテキスト
 * @returns Notion APIに送信可能なブロック配列
 */
export async function markdownToBlocks(markdown: string): Promise<NotionBlock[]> {
  // マークダウンを解析してMdBlock配列に変換
  const mdBlocks = parseMarkdown(markdown)
  
  // MdBlock配列をNotionブロック配列に変換
  const notionBlocks = mdBlocksToNotionBlocks(mdBlocks)
  
  // デバッグ用：言語情報の表示
  notionBlocks.forEach(block => {
    if (block.type === 'code') {
      console.error(`Notion block - code block with language: '${block.code.language}'`)
    }
  })
  
  return notionBlocks
}

/**
 * マークダウンをMdBlockオブジェクトの配列に解析
 */
function parseMarkdown(markdown: string): MdBlock[] {
  // 改行で分割して処理
  const lines = markdown.split('\n')
  const blocks: MdBlock[] = []
  
  let currentBlock: MdBlock | null = null
  let codeBlockContent: string[] = []
  let inCodeBlock = false
  let codeBlockLanguage = 'plain'
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // コードブロック内の処理
    if (inCodeBlock) {
      if (line.trim() === '```') {
        // コードブロック終了
        console.error(`Code block ended, language: '${codeBlockLanguage}', content length: ${codeBlockContent.length}`);
        blocks.push({
          type: 'codeBlock',
          content: codeBlockContent.join('\n'),
          language: codeBlockLanguage
        })
        codeBlockContent = []
        inCodeBlock = false
      } else {
        codeBlockContent.push(line)
      }
      continue
    }
    
    // コードブロック開始判定
    if (line.trim().startsWith('```')) {
      inCodeBlock = true;
      const codeLangMatch = line.trim().match(/^```([a-zA-Z0-9_+-]*)/); 
      
      // 言語情報を取得し正規化
      if (codeLangMatch && codeLangMatch[1]) {
        const detectedLang = codeLangMatch[1].trim();
        codeBlockLanguage = normalizeLanguage(detectedLang);
      } else {
        codeBlockLanguage = 'plain text';
      }
      
      console.error(`Code block started, language detected: '${codeLangMatch?.[1] || ''}', normalized to: '${codeBlockLanguage}'`);
      continue;
    }
    
    // 空行の処理
    if (line.trim() === '') {
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
      continue
    }
    
    // 見出しの処理
    if (line.startsWith('# ')) {
      if (currentBlock) {
        blocks.push(currentBlock)
      }
      currentBlock = {
        type: 'heading1',
        content: line.substring(2).trim()
      }
      blocks.push(currentBlock)
      currentBlock = null
      continue
    }
    
    if (line.startsWith('## ')) {
      if (currentBlock) {
        blocks.push(currentBlock)
      }
      currentBlock = {
        type: 'heading2',
        content: line.substring(3).trim()
      }
      blocks.push(currentBlock)
      currentBlock = null
      continue
    }
    
    if (line.startsWith('### ')) {
      if (currentBlock) {
        blocks.push(currentBlock)
      }
      currentBlock = {
        type: 'heading3',
        content: line.substring(4).trim()
      }
      blocks.push(currentBlock)
      currentBlock = null
      continue
    }
    
    // 箇条書きの処理
    if (line.match(/^[\s]*[-*+][\s]+/)) {
      if (currentBlock && currentBlock.type !== 'bulletedList') {
        blocks.push(currentBlock)
        currentBlock = null
      }
      
      const content = line.replace(/^[\s]*[-*+][\s]+/, '').trim()
      if (!currentBlock) {
        currentBlock = {
          type: 'bulletedList',
          content: content
        }
      } else {
        // 既存の箇条書きブロックを追加し、新しいブロックを作成
        blocks.push(currentBlock)
        currentBlock = {
          type: 'bulletedList',
          content: content
        }
      }
      continue
    }
    
    // 番号付きリストの処理
    if (line.match(/^[\s]*\d+\.[\s]+/)) {
      if (currentBlock && currentBlock.type !== 'numberedList') {
        blocks.push(currentBlock)
        currentBlock = null
      }
      
      const content = line.replace(/^[\s]*\d+\.[\s]+/, '').trim()
      if (!currentBlock) {
        currentBlock = {
          type: 'numberedList',
          content: content
        }
      } else {
        // 既存の番号付きリストブロックを追加し、新しいブロックを作成
        blocks.push(currentBlock)
        currentBlock = {
          type: 'numberedList',
          content: content
        }
      }
      continue
    }
    
    // 引用の処理
    if (line.startsWith('> ')) {
      if (currentBlock && currentBlock.type !== 'blockquote') {
        blocks.push(currentBlock)
        currentBlock = null
      }
      
      const content = line.substring(2).trim()
      if (!currentBlock) {
        currentBlock = {
          type: 'blockquote',
          content: content
        }
      } else {
        currentBlock.content += '\n' + content
      }
      continue
    }
    
    // 区切り線
    if (line.match(/^[\s]*[-*_]{3,}[\s]*$/)) {
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
      blocks.push({
        type: 'divider',
        content: ''
      })
      continue
    }
    
    // 通常の段落
    if (!currentBlock) {
      currentBlock = {
        type: 'paragraph',
        content: line
      }
    } else if (currentBlock.type === 'paragraph') {
      currentBlock.content += '\n' + line
    } else {
      blocks.push(currentBlock)
      currentBlock = {
        type: 'paragraph',
        content: line
      }
    }
  }
  
  // 残りのブロックを追加
  if (currentBlock) {
    blocks.push(currentBlock)
  }
  
  // コードブロックが閉じられていない場合
  if (inCodeBlock && codeBlockContent.length > 0) {
    blocks.push({
      type: 'codeBlock',
      content: codeBlockContent.join('\n'),
      language: codeBlockLanguage
    })
  }
  
  return blocks
}

/**
 * MdBlockオブジェクトをNotionブロックに変換
 */
function mdBlocksToNotionBlocks(mdBlocks: MdBlock[]): NotionBlock[] {
  console.error(`Converting ${mdBlocks.length} blocks to Notion format`);
  
  return mdBlocks.map(block => {
    console.error(`Converting block type: ${block.type}${block.language ? ', language: ' + block.language : ''}`);
    
    switch (block.type) {
      case 'paragraph':
        return {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: textToRichText(block.content)
          }
        }
        
      case 'heading1':
        return {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: textToRichText(block.content)
          }
        }
        
      case 'heading2':
        return {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: textToRichText(block.content)
          }
        }
        
      case 'heading3':
        return {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: textToRichText(block.content)
          }
        }
        
      case 'bulletedList':
        return {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: textToRichText(block.content)
          }
        }
        
      case 'numberedList':
        return {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: textToRichText(block.content)
          }
        }
        
      case 'codeBlock':
        // 言語情報は既に正規化されているはずだが、安全のために確実にチェック
        let finalLang = block.language || 'plain text';
        console.error(`Creating code block with language: '${finalLang}'`);
        
        return {
          object: 'block',
          type: 'code',
          code: {
            rich_text: textToRichText(block.content),
            language: finalLang
          }
        }
        
      case 'blockquote':
        return {
          object: 'block',
          type: 'quote',
          quote: {
            rich_text: textToRichText(block.content)
          }
        }
        
      case 'divider':
        return {
          object: 'block',
          type: 'divider',
          divider: {}
        }
        
      default:
        // 未対応のブロックタイプは段落として扱う
        return {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: textToRichText(block.content || '')
          }
        }
    }
  })
}
