import { ChangeEvent, KeyboardEvent } from 'react'
import styles from './TopBar.module.css'
import { CategoryDef } from '../types'

export type SaveTarget = 'auto' | string

interface Props {
  query: string
  saveTarget: SaveTarget
  categories: CategoryDef[]
  onMenuOpen: () => void
  onQuery: (q: string) => void
  onSearch: () => void
  onSaveTarget: (t: SaveTarget) => void
}

export function TopBar({ query, saveTarget, categories, onMenuOpen, onQuery, onSearch, onSaveTarget }: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchRow}>
        <button className={styles.menuBtn} onClick={onMenuOpen} title="メニュー">☰</button>
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
          <button
            className={`${styles.targetBtn} ${saveTarget === 'auto' ? styles.targetActive : ''}`}
            onClick={() => onSaveTarget('auto')}
          >
            <span>✦</span>
            <span>AI自動</span>
          </button>
          {categories.map((cat) => {
            const isActive = saveTarget === cat.id
            return (
              <button
                key={cat.id}
                className={`${styles.targetBtn} ${isActive ? styles.targetActive : ''}`}
                style={isActive ? { background: cat.colors.bg, color: cat.colors.text, borderColor: cat.colors.border } : {}}
                onClick={() => onSaveTarget(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
