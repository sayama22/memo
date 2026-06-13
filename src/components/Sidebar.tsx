import styles from './Sidebar.module.css'
import { Category } from '../types'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../utils'

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
}

function FolderItem({ id, label, icon, selected, count, onSelect, orange }: ItemProps) {
  const isActive = selected === id
  return (
    <button
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={() => onSelect(id)}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.itemLabel}>{label}</span>
      <span className={`${styles.badge} ${orange ? styles.badgeOrange : ''} ${count === 0 ? styles.badgeZero : ''}`}>
        {count}
      </span>
    </button>
  )
}
