import { useState } from 'react'
import { useMemos } from './hooks/useMemos'
import { useCategories } from './hooks/useCategories'
import { useImageStore } from './hooks/useImageStore'
import { Sidebar, Folder } from './components/Sidebar'
import { TopBar, SaveTarget } from './components/TopBar'
import { MemoInput, PendingImage } from './components/MemoInput'
import { MemoList } from './components/MemoList'
import styles from './App.module.css'

export default function App() {
  const { memos, addMemo, updateMemo, deleteMemo, hardDeleteMemo, restoreMemo, emptyCompleted, filterMemos, countFor } = useMemos()
  const { categories, addCategory, removeCategory, getCategoryDef } = useCategories()
  const { addImage, removeImage, getImage } = useImageStore()

  const [folder, setFolder] = useState<Folder>('all')
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [saveTarget, setSaveTarget] = useState<SaveTarget>('auto')

  const SPECIAL_FOLDERS = ['all', 'important', 'pinned', 'completed']

  const counts: Record<string, number> = {
    all: countFor('all'),
    important: countFor('important'),
    pinned: countFor('pinned'),
    completed: countFor('completed'),
    ...Object.fromEntries(categories.map((c) => [c.id, countFor(c.id)])),
  }

  const isCompletedView = folder === 'completed'
  const visible = filterMemos(folder, activeQuery)

  const handleSave = async (text: string, pendingImages: PendingImage[]) => {
    const imageIds = await Promise.all(pendingImages.map((img) => addImage(img.dataUrl)))
    addMemo(text, saveTarget === 'auto' ? undefined : saveTarget, imageIds)
  }

  const handleHardDelete = async (id: string) => {
    const memo = memos.find((m) => m.id === id)
    if (memo) {
      await Promise.all(memo.imageIds.map((imgId) => removeImage(imgId)))
    }
    hardDeleteMemo(id)
  }

  const handleEmptyCompleted = async () => {
    const completed = memos.filter((m) => m.completed)
    await Promise.all(completed.flatMap((m) => m.imageIds.map((imgId) => removeImage(imgId))))
    emptyCompleted()
  }

  const handleFolderSelect = (f: Folder) => {
    setFolder(f)
    setActiveQuery('')
    setQuery('')
    if (!SPECIAL_FOLDERS.includes(f)) {
      setSaveTarget(f)
    } else {
      setSaveTarget('auto')
    }
  }

  return (
    <div className={styles.app}>
      <Sidebar
        selected={folder}
        categories={categories}
        counts={counts}
        onSelect={handleFolderSelect}
        onAddCategory={addCategory}
        onRemoveCategory={(id) => {
          removeCategory(id)
          if (folder === id) setFolder('all')
        }}
      />
      <main className={styles.main}>
        <TopBar
          query={query}
          saveTarget={saveTarget}
          categories={categories}
          onQuery={setQuery}
          onSearch={() => setActiveQuery(query)}
          onSaveTarget={setSaveTarget}
        />
        {!isCompletedView && (
          <MemoInput
            saveTarget={saveTarget}
            getCategoryDef={getCategoryDef}
            onSave={handleSave}
          />
        )}
        <MemoList
          memos={visible}
          categories={categories}
          getCategoryDef={getCategoryDef}
          getImage={getImage}
          completedView={isCompletedView}
          onUpdate={(id, content, category) => updateMemo(id, { content, category })}
          onToggleImportant={(id) => {
            const m = memos.find((x) => x.id === id)
            if (m) updateMemo(id, { important: !m.important })
          }}
          onTogglePin={(id) => {
            const m = memos.find((x) => x.id === id)
            if (m) updateMemo(id, { pinned: !m.pinned })
          }}
          onDelete={deleteMemo}
          onHardDelete={handleHardDelete}
          onRestore={restoreMemo}
          onEmptyCompleted={handleEmptyCompleted}
        />
      </main>
    </div>
  )
}
