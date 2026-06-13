import { KeyboardEvent, useRef, useState } from 'react'
import styles from './MemoInput.module.css'
import { CategoryDef } from '../types'

interface Props {
  saveTarget: 'auto' | string
  getCategoryDef: (id: string) => CategoryDef
  onSave: (text: string) => void
}

export function MemoInput({ saveTarget, getCategoryDef, onSave }: Props) {
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

  const catDef = saveTarget !== 'auto' ? getCategoryDef(saveTarget) : null
  const placeholder = catDef
    ? `${catDef.label} にメモを追加... (Ctrl+Enter で保存)`
    : 'メモを入力 — AIが自動で仕分け保存します (Ctrl+Enter)'

  return (
    <div
      className={styles.wrapper}
      style={catDef ? { borderLeftColor: catDef.colors.border, borderLeftWidth: 4 } : {}}
    >
      <div className={styles.inner}>
        {catDef && (
          <span
            className={styles.categoryBadge}
            style={{ background: catDef.colors.bg, color: catDef.colors.text, borderColor: catDef.colors.border }}
          >
            {catDef.icon} {catDef.label}
          </span>
        )}
        <textarea
          ref={ref}
          className={styles.textarea}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        className={`${styles.saveBtn} ${!text.trim() ? styles.disabled : ''}`}
        style={catDef && text.trim() ? { color: catDef.colors.text } : {}}
        onClick={handleSave}
        disabled={!text.trim()}
      >
        <span className={styles.sendIcon}>✈</span>
        <span>保存</span>
      </button>
    </div>
  )
}
