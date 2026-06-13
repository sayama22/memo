export function exportCsv(memos: { content: string; category: string; createdAt: number }[], labelOf: (id: string) => string) {
  const header = 'content,category,date'
  const rows = memos.map((m) => {
    const content = `"${m.content.replace(/"/g, '""')}"`
    const category = labelOf(m.category)
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
