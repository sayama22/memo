import { useState, useEffect } from 'react'
import { Memo, Category } from '../types'
import { autoCategory } from '../categorize'

const STORAGE_KEY = 'memo-app-v2'

function load(): Memo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const memos = raw ? (JSON.parse(raw) as Memo[]) : []
    // migrate old memos that don't have the completed field
    return memos.map((m) => {
      const migrated = { ...m }
      if (!Array.isArray(migrated.imageIds)) migrated.imageIds = []
      if (migrated.completed === undefined) migrated.completed = false
      return migrated
    })
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

  const addMemo = (content: string, categoryOverride?: Category, imageIds: string[] = []) => {
    const memo: Memo = {
      id: Date.now().toString(),
      content: content.trim(),
      category: categoryOverride ?? autoCategory(content),
      important: false,
      pinned: false,
      createdAt: Date.now(),
      completed: false,
      imageIds,
    }
    setMemos((prev) => [memo, ...prev])
    return memo
  }

  const updateMemo = (id: string, changes: Partial<Omit<Memo, 'id' | 'createdAt'>>) => {
    setMemos((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m)))
  }

  // soft delete: move to 完了
  const deleteMemo = (id: string) => {
    setMemos((prev) => prev.map((m) => m.id === id ? { ...m, completed: true, pinned: false } : m))
  }

  // hard delete: remove permanently (only from 完了 view)
  const hardDeleteMemo = (id: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== id))
  }

  // restore from 完了 back to active
  const restoreMemo = (id: string) => {
    setMemos((prev) => prev.map((m) => m.id === id ? { ...m, completed: false } : m))
  }

  // empty all completed
  const emptyCompleted = () => {
    setMemos((prev) => prev.filter((m) => !m.completed))
  }

  const filterMemos = (folder: string, query: string) => {
    return memos.filter((m) => {
      // 完了フォルダー以外では completed を除外
      if (folder === 'completed') return m.completed && (!query || m.content.toLowerCase().includes(query.toLowerCase()))
      if (m.completed) return false
      if (folder === 'important' && !m.important) return false
      if (folder === 'pinned' && !m.pinned) return false
      if (folder !== 'all' && folder !== 'important' && folder !== 'pinned' && m.category !== folder) return false
      if (query && !m.content.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }

  const countFor = (folder: string) => {
    if (folder === 'completed') return memos.filter((m) => m.completed).length
    const active = memos.filter((m) => !m.completed)
    if (folder === 'all') return active.length
    if (folder === 'important') return active.filter((m) => m.important).length
    if (folder === 'pinned') return active.filter((m) => m.pinned).length
    return active.filter((m) => m.category === folder).length
  }

  return { memos, addMemo, updateMemo, deleteMemo, hardDeleteMemo, restoreMemo, emptyCompleted, filterMemos, countFor }
}
