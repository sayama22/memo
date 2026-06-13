import { useState } from 'react'
import styles from './Sidebar.module.css'
import { CategoryDef } from '../types'
import { COLOR_PALETTE } from '../hooks/useCategories'

export type Folder = 'all' | 'important' | 'pinned' | string

interface Props {
  selected: Folder
  categories: CategoryDef[]
  counts: Record<string, number>
  onSelect: (f: Folder) => void
  onAddCategory: (label: string, icon: string, colors: CategoryDef['colors']) => void
  onRemoveCategory: (id: string) => void
}

const ICON_OPTIONS = ['📂', '🏠', '🎯', '🔖', '🛒', '📝', '🎨', '🏋️', '🎵', '🌱', '🔧', '🚀', '💰', '📚', '🎮', '✈️']

export function Sidebar({ selected, categories, counts, onSelect, onAddCategory, onRemoveCategory }: Props) {
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newIcon, setNewIcon] = useState('📂')
  const [newColor, setNewColor] = useState(0)

  const handleAdd = () => {
    if (!newLabel.trim()) return
    onAddCategory(newLabel.trim(), newIcon, COLOR_PALETTE[newColor])
    setNewLabel('')
    setNewIcon('📂')
    setNewColor(0)
    setAdding(false)
  }

  return (
    <aside className={styles.sidebar}>
      <p className={styles.label}>フォルダー</p>
      <nav className={styles.nav}>
        <FolderItem id="all" label="すべて" icon="📋" selected={selected} count={counts['all'] ?? 0} onSelect={onSelect} />
        <FolderItem id="important" label="重要" icon="⭐" selected={selected} count={counts['important'] ?? 0} onSelect={onSelect} badgeStyle={{ background: '#f59e0b', color: '#fff' }} />
        <FolderItem id="pinned" label="ピン留め" icon="📌" selected={selected} count={counts['pinned'] ?? 0} onSelect={onSelect} />
        <hr className={styles.divider} />
        {categories.map((cat) => (
          <FolderItem
            key={cat.id}
            id={cat.id}
            label={cat.label}
            icon={cat.icon}
            selected={selected}
            count={counts[cat.id] ?? 0}
            onSelect={onSelect}
            color={cat.colors}
            onRemove={!cat.builtin ? () => onRemoveCategory(cat.id) : undefined}
          />
        ))}
      </nav>

      {adding ? (
        <div className={styles.addForm}>
          <div className={styles.addRow}>
            <select
              className={styles.iconSelect}
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
            >
              {ICON_OPTIONS.map((ic) => (
                <option key={ic} value={ic}>{ic}</option>
              ))}
            </select>
            <input
              className={styles.addInput}
              placeholder="カテゴリー名"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
              autoFocus
            />
          </div>
          <div className={styles.colorRow}>
            {COLOR_PALETTE.map((c, i) => (
              <button
                key={i}
                className={`${styles.colorSwatch} ${newColor === i ? styles.colorSwatchActive : ''}`}
                style={{ background: c.bg, borderColor: newColor === i ? c.text : c.border }}
                onClick={() => setNewColor(i)}
              />
            ))}
          </div>
          <div className={styles.addActions}>
            <button className={styles.addConfirmBtn} onClick={handleAdd} disabled={!newLabel.trim()}>追加</button>
            <button className={styles.addCancelBtn} onClick={() => setAdding(false)}>キャンセル</button>
          </div>
        </div>
      ) : (
        <button className={styles.addCategoryBtn} onClick={() => setAdding(true)}>
          ＋ カテゴリーを追加
        </button>
      )}
    </aside>
  )
}

interface ItemProps {
  id: string
  label: string
  icon: string
  selected: string
  count: number
  onSelect: (f: string) => void
  color?: { bg: string; text: string; border: string }
  badgeStyle?: React.CSSProperties
  onRemove?: () => void
}

function FolderItem({ id, label, icon, selected, count, onSelect, color, badgeStyle, onRemove }: ItemProps) {
  const isActive = selected === id
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`${styles.itemWrapper} ${isActive ? styles.itemWrapperActive : ''}`}
      style={
        isActive && color
          ? { background: color.bg, borderLeft: `3px solid ${color.text}` }
          : color
          ? { borderLeft: '3px solid transparent' }
          : {}
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        className={styles.item}
        style={isActive && color ? { color: color.text } : {}}
        onClick={() => onSelect(id)}
      >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.itemLabel}>{label}</span>
        <span
          className={`${styles.badge} ${count === 0 ? styles.badgeZero : ''}`}
          style={
            isActive && color
              ? { background: color.border, color: color.text }
              : badgeStyle && count > 0
              ? badgeStyle
              : {}
          }
        >
          {count}
        </span>
      </button>
      {onRemove && hovered && (
        <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); onRemove() }} title="削除">✕</button>
      )}
    </div>
  )
}
