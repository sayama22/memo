import { ChangeEvent } from 'react'
import styles from './TopBar.module.css'
import { Memo } from '../types'
import { exportCsv } from '../utils'

export type Period = 'all' | 'today' | 'week' | 'month'

interface Props {
  query: string
  period: Period
  memos: Memo[]
  onQuery: (q: string) => void
  onPeriod: (p: Period) => void
}

const PERIODS: { id: Period; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'today', label: '今日' },
  { id: 'week', label: '今週' },
  { id: 'month', label: '今月' },
]

export function TopBar({ query, period, memos, onQuery, onPeriod }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.input}
            placeholder="メモを検索..."
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onQuery(e.target.value)}
          />
          {query && (
            <button className={styles.clear} onClick={() => onQuery('')}>✕</button>
          )}
        </div>
        <button className={styles.csvBtn} onClick={() => exportCsv(memos)}>
          ↓ CSV
        </button>
      </div>
      <div className={styles.periods}>
        <span className={styles.periodLabel}>期間:</span>
        {PERIODS.map((p) => (
          <button
            key={p.id}
            className={`${styles.periodBtn} ${period === p.id ? styles.periodActive : ''}`}
            onClick={() => onPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
