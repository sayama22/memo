import { Category } from './types'

export const CATEGORY_LABELS: Record<Category, string> = {
  work: '仕事',
  private: 'プライベート',
  idea: 'アイデア',
  todo: 'やること',
  other: 'その他',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  work: '💼',
  private: '👤',
  idea: '💡',
  todo: '✅',
  other: '📁',
}

export function exportCsv(memos: { content: string; category: Category; createdAt: number }[]) {
  const header = 'content,category,date'
  const rows = memos.map((m) => {
    const content = `"${m.content.replace(/"/g, '""')}"`
    const category = CATEGORY_LABELS[m.category]
    const date = new Date(m.createdAt).toLocaleString('ja-JP')
    return `${content},${category},${date}`
  })
  const csv = [header, ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `memo-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
