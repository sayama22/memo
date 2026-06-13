import { ChangeEvent, KeyboardEvent } from 'react'
import styles from './TopBar.module.css'
import { Category } from '../types'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../utils'

export type SaveTarget = 'auto' | Category

interface Props {
  query: string
  saveTarget: SaveTarget
  onQuery: (q: string) => void
  onSearch: () => void
  onSaveTarget: (t: SaveTarget) => void
}

const SAVE_TARGETS: { id: SaveTarget; label: string; icon: string }[] = [
  { id: 'auto', label: 'AI自動', icon: '✦' },
  { id: 'work', label: CATEGORY_LABELS.work, icon: CATEGORY_ICONS.work },
  { id: 'private', label: CATEGORY_LABELS.private, icon: CATEGORY_ICONS.private },
  { id: 'idea', label: CATEGORY_LABELS.idea, icon: CATEGORY_ICONS.idea },
  { id: 'todo', label: CATEGORY_LABELS.todo, icon: CATEGORY_ICONS.todo },
  { id: 'other', label: CATEGORY_LABELS.other, icon: CATEGORY_ICONS.other },
]

export function TopBar({ query, saveTarget, onQuery, onSearch, onSaveTarget }: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.input}
            placeholder="メモを検索..."
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className={styles.clear} onClick={() => onQuery('')}>✕</button>
          )}
        </div>
        <button className={styles.searchBtn} onClick={onSearch}>
          🔍 検索
        </button>
      </div>

      <div className={styles.saveRow}>
        <span className={styles.saveLabel}>保存先:</span>
        <div className={styles.saveTargets}>
          {SAVE_TARGETS.map((t) => (
            <button
              key={t.id}
              className={`${styles.targetBtn} ${saveTarget === t.id ? styles.targetActive : ''}`}
              onClick={() => onSaveTarget(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
