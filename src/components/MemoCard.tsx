import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Memo } from '../types'
import { CATEGORY_LABELS } from '../utils'
import styles from './MemoCard.module.css'

interface Props {
  memo: Memo
  onUpdate: (content: string) => void
  onToggleImportant: () => void
  onTogglePin: () => void
  onDelete: () => void
}

export function MemoCard({ memo, onUpdate, onToggleImportant, onTogglePin, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(memo.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus()
      const len = draft.length
      textareaRef.current?.setSelectionRange(len, len)
    }
  }, [editing])

  const commitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== memo.content) {
      onUpdate(trimmed)
    } else {
      setDraft(memo.content)
    }
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(memo.content)
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

  return (
    <article className={`${styles.card} ${editing ? styles.editingCard : ''}`}>
      <div className={styles.body}>
        {editing ? (
          <textarea
            ref={textareaRef}
            className={styles.editTextarea}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
          />
        ) : (
          <p className={styles.content}>{memo.content}</p>
        )}
        <div className={styles.footer}>
          <span className={styles.category}>{CATEGORY_LABELS[memo.category]}</span>
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
            <button
              className={styles.iconBtn}
              onClick={() => setEditing(true)}
              title="編集"
            >
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
