import styles from './Sidebar.module.css'
import { Category } from '../types'
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '../utils'

export type Folder = 'all' | 'important' | 'pinned' | Category

interface Props {
  selected: Folder
  counts: Record<Folder, number>
  onSelect: (f: Folder) => void
}

const CATEGORIES: Category[] = ['work', 'private', 'idea', 'todo', 'other']

export function Sidebar({ selected, counts, onSelect }: Props) {
  return (
    <aside className={styles.sidebar}>
      <p className={styles.label}>フォルダー</p>
      <nav className={styles.nav}>
        <FolderItem id="all" label="すべて" icon="📋" selected={selected} count={counts.all} onSelect={onSelect} />
        <FolderItem id="important" label="重要" icon="⭐" selected={selected} count={counts.important} onSelect={onSelect} orange />
        <FolderItem id="pinned" label="ピン留め" icon="📌" selected={selected} count={counts.pinned} onSelect={onSelect} />
        <hr className={styles.divider} />
        {CATEGORIES.map((cat) => (
          <FolderItem
            key={cat}
            id={cat}
            label={CATEGORY_LABELS[cat]}
            icon={CATEGORY_ICONS[cat]}
            selected={selected}
            count={counts[cat]}
            onSelect={onSelect}
            color={CATEGORY_COLORS[cat]}
          />
        ))}
      </nav>
    </aside>
  )
}

interface ItemProps {
  id: Folder
  label: string
  icon: string
  selected: Folder
  count: number
  onSelect: (f: Folder) => void
  orange?: boolean
  color?: { bg: string; text: string; border: string }
}

function FolderItem({ id, label, icon, selected, count, onSelect, orange, color }: ItemProps) {
  const isActive = selected === id
  return (
    <button
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      style={
        isActive && color
          ? { background: color.bg, color: color.text, borderLeft: `3px solid ${color.border}` }
          : color
          ? { borderLeft: '3px solid transparent' }
          : {}
      }
      onClick={() => onSelect(id)}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.itemLabel}>{label}</span>
      <span
        className={`${styles.badge} ${orange ? styles.badgeOrange : ''} ${count === 0 ? styles.badgeZero : ''}`}
        style={isActive && color ? { background: color.border, color: color.text } : {}}
      >
        {count}
      </span>
    </button>
  )
}
