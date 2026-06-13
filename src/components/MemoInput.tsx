import { ClipboardEvent, DragEvent, KeyboardEvent, useRef, useState } from 'react'
import styles from './MemoInput.module.css'
import { CategoryDef } from '../types'

export interface PendingImage {
  tempId: string
  dataUrl: string
}

interface Props {
  saveTarget: 'auto' | string
  getCategoryDef: (id: string) => CategoryDef
  onSave: (text: string, images: PendingImage[]) => void
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function MemoInput({ saveTarget, getCategoryDef, onSave }: Props) {
  const [text, setText] = useState('')
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const [dragging, setDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    if (!text.trim() && pendingImages.length === 0) return
    onSave(text, pendingImages)
    setText('')
    setPendingImages([])
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  const addFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    const newImages = await Promise.all(
      imageFiles.map(async (f) => ({
        tempId: `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        dataUrl: await fileToDataUrl(f),
      })),
    )
    setPendingImages((prev) => [...prev, ...newImages])
  }

  const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items
    const imageItems = Array.from(items).filter((i) => i.type.startsWith('image/'))
    if (imageItems.length > 0) {
      e.preventDefault()
      const files = imageItems.map((i) => i.getAsFile()).filter(Boolean) as File[]
      await addFiles(files)
    }
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    await addFiles(e.dataTransfer.files)
  }

  const removeImage = (tempId: string) => {
    setPendingImages((prev) => prev.filter((img) => img.tempId !== tempId))
  }

  const catDef = saveTarget !== 'auto' ? getCategoryDef(saveTarget) : null
  const placeholder = catDef
    ? `${catDef.label} にメモを追加... (Ctrl+Enter で保存)`
    : 'メモを入力 — AIが自動で仕分け保存します (Ctrl+Enter)'

  const canSave = text.trim().length > 0 || pendingImages.length > 0

  return (
    <div
      className={`${styles.wrapper} ${dragging ? styles.dragging : ''}`}
      style={catDef ? { borderLeftColor: catDef.colors.border, borderLeftWidth: 4 } : {}}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
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
          ref={textareaRef}
          className={styles.textarea}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        {pendingImages.length > 0 && (
          <div className={styles.imagePreviewRow}>
            {pendingImages.map((img) => (
              <div key={img.tempId} className={styles.imageThumb}>
                <img src={img.dataUrl} alt="" />
                <button className={styles.removeImageBtn} onClick={() => removeImage(img.tempId)}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div className={styles.attachRow}>
          <button
            className={styles.attachBtn}
            onClick={() => fileInputRef.current?.click()}
            title="画像を添付"
          >
            📎 画像を添付
          </button>
          <span className={styles.dropHint}>またはドラッグ&ドロップ / 貼り付け</span>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />
      <button
        className={`${styles.saveBtn} ${!canSave ? styles.disabled : ''}`}
        style={catDef && canSave ? { color: catDef.colors.text } : {}}
        onClick={handleSave}
        disabled={!canSave}
      >
        <span className={styles.sendIcon}>✈</span>
        <span>保存</span>
      </button>
    </div>
  )
}
