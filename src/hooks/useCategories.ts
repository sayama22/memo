import { CategoryDef } from '../types'
import { useState, useEffect } from 'react'

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { id: 'work',    label: '仕事',        icon: '💼', colors: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' }, builtin: true },
  { id: 'private', label: 'プライベート', icon: '👤', colors: { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' }, builtin: true },
  { id: 'idea',    label: 'アイデア',    icon: '💡', colors: { bg: '#fef9c3', text: '#a16207', border: '#fde68a' }, builtin: true },
  { id: 'todo',    label: 'やること',    icon: '✅', colors: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' }, builtin: true },
  { id: 'other',   label: 'その他',      icon: '📁', colors: { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' }, builtin: true },
]

export const COLOR_PALETTE: CategoryDef['colors'][] = [
  { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' },
  { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
  { bg: '#cffafe', text: '#0e7490', border: '#a5f3fc' },
  { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  { bg: '#fdf4ff', text: '#86198f', border: '#f5d0fe' },
  { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
  { bg: '#f0f9ff', text: '#075985', border: '#bae6fd' },
]

const STORAGE_KEY = 'memo-categories-v1'

function load(): CategoryDef[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CATEGORIES
    const custom: CategoryDef[] = JSON.parse(raw)
    // merge: keep default ordering, append custom
    const defaultIds = new Set(DEFAULT_CATEGORIES.map((c) => c.id))
    const customOnly = custom.filter((c) => !defaultIds.has(c.id))
    return [...DEFAULT_CATEGORIES, ...customOnly]
  } catch {
    return DEFAULT_CATEGORIES
  }
}

function saveCustom(categories: CategoryDef[]) {
  const custom = categories.filter((c) => !c.builtin)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDef[]>(load)

  useEffect(() => {
    saveCustom(categories)
  }, [categories])

  const addCategory = (label: string, icon: string, colors: CategoryDef['colors']) => {
    const id = `custom-${Date.now()}`
    setCategories((prev) => [...prev, { id, label, icon, colors }])
    return id
  }

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const getCategoryDef = (id: string): CategoryDef =>
    categories.find((c) => c.id === id) ?? {
      id,
      label: id,
      icon: '📄',
      colors: { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' },
    }

  return { categories, addCategory, removeCategory, getCategoryDef }
}
