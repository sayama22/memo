import { useRef } from 'react'
import { CategoryDef, Memo } from '../types'
import { MemoCard } from './MemoCard'
import styles from './MemoList.module.css'

interface Props {
  memos: Memo[]
  categories: CategoryDef[]
  getCategoryDef: (id: string) => CategoryDef
  getImage: (id: string) => string | undefined
  completedView?: boolean
  onUpdate: (id: string, content: string, category: string) => void
  onToggleImportant: (id: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
  onHardDelete?: (id: string) => void
  onRestore?: (id: string) => void
  onEmptyCompleted?: () => void
}

export function MemoList({ memos, categories, getCategoryDef, getImage, completedView, onUpdate, onToggleImportant, onTogglePin, onDelete, onHardDelete, onRestore, onEmptyCompleted }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.wrapper}>
      {completedView && memos.length > 0 && (
        <div className={styles.completedHeader}>
          <span className={styles.completedCount}>{memos.length} 件</span>
          <button className={styles.emptyBtn} onClick={onEmptyCompleted}>
            🗑 すべて完全削除
          </button>
        </div>
      )}
      <div className={styles.list}>
        {memos.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>{completedView ? '✓' : '🗒'}</span>
            <p>{completedView ? '完了したメモはありません' : 'メモはありません'}</p>
          </div>
        ) : (
          memos.map((m) => (
            <MemoCard
              key={m.id}
              memo={m}
              categories={categories}
              getCategoryDef={getCategoryDef}
              getImage={getImage}
              completedView={completedView}
              onUpdate={(content, category) => onUpdate(m.id, content, category)}
              onToggleImportant={() => onToggleImportant(m.id)}
              onTogglePin={() => onTogglePin(m.id)}
              onDelete={() => onDelete(m.id)}
              onHardDelete={() => onHardDelete?.(m.id)}
              onRestore={() => onRestore?.(m.id)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
      {memos.length > 3 && (
        <button className={styles.scrollBtn} onClick={scrollToBottom} title="最下部へ">↓</button>
      )}
    </div>
  )
}
