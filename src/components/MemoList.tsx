import { useRef } from 'react'
import { Memo } from '../types'
import { MemoCard } from './MemoCard'
import styles from './MemoList.module.css'

interface Props {
  memos: Memo[]
  onToggleImportant: (id: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
}

export function MemoList({ memos, onToggleImportant, onTogglePin, onDelete }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {memos.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🗒</span>
            <p>メモはありません</p>
          </div>
        ) : (
          memos.map((m) => (
            <MemoCard
              key={m.id}
              memo={m}
              onToggleImportant={() => onToggleImportant(m.id)}
              onTogglePin={() => onTogglePin(m.id)}
              onDelete={() => onDelete(m.id)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
      {memos.length > 3 && (
        <button className={styles.scrollBtn} onClick={scrollToBottom} title="最下部へ">
          ↓
        </button>
      )}
    </div>
  )
}
