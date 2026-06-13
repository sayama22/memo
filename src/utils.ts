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

/** bg / text / border */
export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  work:    { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
  private: { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' },
  idea:    { bg: '#fef9c3', text: '#a16207', border: '#fde68a' },
  todo:    { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  other:   { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' },
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
