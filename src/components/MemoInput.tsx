import { KeyboardEvent, useRef, useState } from 'react'
import styles from './MemoInput.module.css'
import { Category } from '../types'

interface Props {
  saveTarget: 'auto' | Category
  onSave: (text: string) => void
}

export function MemoInput({ saveTarget, onSave }: Props) {
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

  const placeholder =
    saveTarget === 'auto'
      ? 'メモを入力 — AIが自動で仕分け保存します (Ctrl+Enter)'
      : `メモを入力 — Ctrl+Enterで保存`

  return (
    <div className={styles.wrapper}>
      <textarea
        ref={ref}
        className={styles.textarea}
        placeholder={placeholder}
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
