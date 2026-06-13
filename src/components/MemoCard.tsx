import { Memo } from '../types'
import { CATEGORY_LABELS } from '../utils'
import styles from './MemoCard.module.css'

interface Props {
  memo: Memo
  onToggleImportant: () => void
  onTogglePin: () => void
  onDelete: () => void
}

export function MemoCard({ memo, onToggleImportant, onTogglePin, onDelete }: Props) {
  const date = new Date(memo.createdAt).toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <p className={styles.content}>{memo.content}</p>
        <div className={styles.footer}>
          <span className={styles.category}>{CATEGORY_LABELS[memo.category]}</span>
          <span className={styles.date}>{date}</span>
        </div>
      </div>
      <div className={styles.actions}>
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
      </div>
    </article>
  )
}
