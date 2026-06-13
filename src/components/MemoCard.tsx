import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { CategoryDef, Memo } from '../types'
import styles from './MemoCard.module.css'


interface Props {
  memo: Memo
  categories: CategoryDef[]
  getCategoryDef: (id: string) => CategoryDef
  getImage: (id: string) => string | undefined
  completedView?: boolean
  onUpdate: (content: string, category: string) => void
  onToggleImportant: () => void
  onTogglePin: () => void
  onDelete: () => void
  onHardDelete?: () => void
  onRestore?: () => void
}

export function MemoCard({ memo, categories, getCategoryDef, getImage, completedView, onUpdate, onToggleImportant, onTogglePin, onDelete, onHardDelete, onRestore }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(memo.content)
  const [draftCategory, setDraftCategory] = useState(memo.category)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
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
    if (trimmed) onUpdate(trimmed, draftCategory)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(memo.content)
    setDraftCategory(memo.category)
    setEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); commitEdit() }
    if (e.key === 'Escape') { e.preventDefault(); cancelEdit() }
  }

  const currentCat = getCategoryDef(editing ? draftCategory : memo.category)
  const color = currentCat.colors

  const date = new Date(memo.createdAt).toLocaleDateString('ja-JP', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <article
      className={`${styles.card} ${editing ? styles.editingCard : ''} ${completedView ? styles.completedCard : ''}`}
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
              {categories.map((cat) => {
                const isActive = draftCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    className={`${styles.catBtn} ${isActive ? styles.catBtnActive : ''}`}
                    style={isActive ? { background: cat.colors.bg, color: cat.colors.text, borderColor: cat.colors.border } : {}}
                    onClick={() => setDraftCategory(cat.id)}
                    type="button"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
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
            className={styles.category}
            style={{ background: color.bg, color: color.text, borderColor: color.border }}
          >
            {currentCat.icon} {currentCat.label}
          </span>
          <span className={styles.date}>{date}</span>
          {editing && (
            <span className={styles.editHint}>Ctrl+Enter で保存 / Esc でキャンセル</span>
          )}
        </div>
        {!editing && memo.imageIds.length > 0 && (
          <div className={styles.imageGrid}>
            {memo.imageIds.map((imgId) => {
              const url = getImage(imgId)
              return url ? (
                <img
                  key={imgId}
                  src={url}
                  className={styles.imageThumb}
                  alt=""
                  onClick={() => setLightboxUrl(url)}
                />
              ) : null
            })}
          </div>
        )}
      </div>

      {lightboxUrl && (
        <div className={styles.lightbox} onClick={() => setLightboxUrl(null)}>
          <img src={lightboxUrl} className={styles.lightboxImg} alt="" onClick={(e) => e.stopPropagation()} />
          <button className={styles.lightboxClose} onClick={() => setLightboxUrl(null)}>✕</button>
        </div>
      )}

      <div className={styles.actions}>
        {completedView ? (
          <>
            <button className={`${styles.iconBtn} ${styles.restoreBtn}`} onClick={onRestore} title="元に戻す">↩</button>
            <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={onHardDelete} title="完全に削除">🗑</button>
          </>
        ) : editing ? (
          <>
            <button className={`${styles.iconBtn} ${styles.saveEditBtn}`} onClick={commitEdit} title="保存">✓</button>
            <button className={`${styles.iconBtn} ${styles.cancelBtn}`} onClick={cancelEdit} title="キャンセル">✕</button>
          </>
        ) : (
          <>
            <button className={styles.iconBtn} onClick={startEdit} title="編集">✏️</button>
            <button className={`${styles.iconBtn} ${memo.important ? styles.active : ''}`} onClick={onToggleImportant} title="重要">⭐</button>
            <button className={`${styles.iconBtn} ${memo.pinned ? styles.active : ''}`} onClick={onTogglePin} title="ピン留め">📌</button>
            <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={onDelete} title="完了へ移動">🗑</button>
          </>
        )}
      </div>
    </article>
  )
}
