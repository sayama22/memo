import { Category } from './types'

const workKeywords = ['会議', '打ち合わせ', '報告', '業務', '仕事', 'プロジェクト', '締め切り', '提出', '納期', 'mtg', 'meeting', 'work', '出社', '残業', '上司', 'クライアント']
const privateKeywords = ['家族', '友達', '旅行', '趣味', '映画', 'ご飯', '買い物', '休み', 'デート', '飲み', '遊び', '帰省']
const ideaKeywords = ['アイデア', '案', '思いついた', '考えた', '発想', '提案', 'どうかな', 'ひらめき', 'もしかして', '企画']
const todoKeywords = ['する', 'やること', 'todo', 'タスク', 'しなければ', 'しないと', '予定', '準備', '買う', '連絡', 'やる', '忘れず']

export function autoCategory(text: string): Category {
  const lower = text.toLowerCase()
  const score = {
    work: workKeywords.filter((k) => lower.includes(k)).length,
    private: privateKeywords.filter((k) => lower.includes(k)).length,
    idea: ideaKeywords.filter((k) => lower.includes(k)).length,
    todo: todoKeywords.filter((k) => lower.includes(k)).length,
  }
  const max = Math.max(score.work, score.private, score.idea, score.todo)
  if (max === 0) return 'other'
  if (score.work === max) return 'work'
  if (score.todo === max) return 'todo'
  if (score.idea === max) return 'idea'
  return 'private'
}
