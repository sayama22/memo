import { KeyboardEvent, useRef, useState } from 'react'
import styles from './MemoInput.module.css'

interface Props {
  onSave: (text: string) => void
}

export function MemoInput({ onSave }: Props) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSave = () => {
    if (!text.trim()) return
    onSave(text)
    setText('')
    ref.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className={styles.wrapper}>
      <textarea
        ref={ref}
        className={styles.textarea}
        placeholder={'メモを入力 — AIが自動で仕分け保存します (Ctrl+Enter)'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
      />
      <button
        className={`${styles.saveBtn} ${!text.trim() ? styles.disabled : ''}`}
        onClick={handleSave}
        disabled={!text.trim()}
      >
        <span className={styles.sendIcon}>✈</span>
        <span>保存</span>
      </button>
    </div>
  )
}
