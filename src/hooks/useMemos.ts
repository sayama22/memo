import { useState, useEffect } from 'react'
import { Memo, Category } from '../types'
import { autoCategory } from '../categorize'

const STORAGE_KEY = 'memo-app-v2'

function load(): Memo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Memo[]) : []
  } catch {
    return []
  }
}

function save(memos: Memo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
}

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>(load)

  useEffect(() => {
    save(memos)
  }, [memos])

  const addMemo = (content: string, categoryOverride?: Category) => {
    const memo: Memo = {
      id: Date.now().toString(),
      content: content.trim(),
      category: categoryOverride ?? autoCategory(content),
      important: false,
      pinned: false,
      createdAt: Date.now(),
    }
    setMemos((prev) => [memo, ...prev])
    return memo
  }

  const updateMemo = (id: string, changes: Partial<Omit<Memo, 'id' | 'createdAt'>>) => {
    setMemos((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m)))
  }

  const deleteMemo = (id: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== id))
  }

  const filterMemos = (
    folder: string,
    query: string,
  ) => {
    return memos.filter((m) => {
      if (folder === 'important' && !m.important) return false
      if (folder === 'pinned' && !m.pinned) return false
      if (folder !== 'all' && folder !== 'important' && folder !== 'pinned' && m.category !== folder) return false
      if (query && !m.content.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }

  const countFor = (folder: string) => {
    if (folder === 'all') return memos.length
    if (folder === 'important') return memos.filter((m) => m.important).length
    if (folder === 'pinned') return memos.filter((m) => m.pinned).length
    return memos.filter((m) => m.category === folder).length
  }

  return { memos, addMemo, updateMemo, deleteMemo, filterMemos, countFor }
}
