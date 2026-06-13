import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Category, Memo } from '../types'
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../utils'
import styles from './MemoCard.module.css'

interface Props {
  memo: Memo
  onUpdate: (content: string, category: Category) => void
  onToggleImportant: () => void
  onTogglePin: () => void
  onDelete: () => void
}

const CATEGORIES: Category[] = ['work', 'private', 'idea', 'todo', 'other']

export function MemoCard({ memo, onUpdate, onToggleImportant, onTogglePin, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(memo.content)
  const [draftCategory, setDraftCategory] = useState<Category>(memo.category)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus()
      const len = draft.length
      textareaRef.current?.setSelectionRange(len, len)
    }
  }, [editing])

  const startEdit = () => {
    setDraft(memo.content)
    setDraftCategory(memo.category)
    setEditing(true)
  }

  const commitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed) {
      onUpdate(trimmed, draftCategory)
    }
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(memo.content)
    setDraftCategory(memo.category)
    setEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      commitEdit()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }

  const date = new Date(memo.createdAt).toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const color = CATEGORY_COLORS[editing ? draftCategory : memo.category]

  return (
    <article
      className={`${styles.card} ${editing ? styles.editingCard : ''}`}
      style={{ borderLeftColor: color.border, borderLeftWidth: 4 }}
    >
      <div className={styles.body}>
        {editing ? (
          <>
            <textarea
              ref={textareaRef}
              className={styles.editTextarea}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
            />
            <div className={styles.categorySelector}>
              {CATEGORIES.map((cat) => {
                const c = CATEGORY_COLORS[cat]
                const isActive = draftCategory === cat
                return (
                  <button
                    key={cat}
                    className={`${styles.catBtn} ${isActive ? styles.catBtnActive : ''}`}
                    style={isActive ? { background: c.bg, color: c.text, borderColor: c.border } : {}}
                    onClick={() => setDraftCategory(cat)}
                    type="button"
                  >
                    <span>{CATEGORY_ICONS[cat]}</span>
                    <span>{CATEGORY_LABELS[cat]}</span>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <p className={styles.content}>{memo.content}</p>
        )}
        <div className={styles.footer}>
          <span
            className={`${styles.category} ${editing ? styles.categoryEditing : ''}`}
            style={{ background: color.bg, color: color.text, borderColor: color.border }}
          >
            {editing ? CATEGORY_LABELS[draftCategory] : CATEGORY_LABELS[memo.category]}
          </span>
          <span className={styles.date}>{date}</span>
          {editing && (
            <span className={styles.editHint}>Ctrl+Enter で保存 / Esc でキャンセル</span>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        {editing ? (
          <>
            <button className={`${styles.iconBtn} ${styles.saveEditBtn}`} onClick={commitEdit} title="保存">
              ✓
            </button>
            <button className={`${styles.iconBtn} ${styles.cancelBtn}`} onClick={cancelEdit} title="キャンセル">
              ✕
            </button>
          </>
        ) : (
          <>
            <button className={styles.iconBtn} onClick={startEdit} title="編集">
              ✏️
            </button>
            <button
              className={`${styles.iconBtn} ${memo.important ? styles.active : ''}`}
              onClick={onToggleImportant}
              title="重要"
            >
              ⭐
            </button>
            <button
              className={`${styles.iconBtn} ${memo.pinned ? styles.active : ''}`}
              onClick={onTogglePin}
              title="ピン留め"
            >
              📌
            </button>
            <button
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={onDelete}
              title="削除"
            >
              🗑
            </button>
          </>
        )}
      </div>
    </article>
  )
}
