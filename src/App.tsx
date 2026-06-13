import { useState } from 'react'
import { useMemos } from './hooks/useMemos'
import { useCategories } from './hooks/useCategories'
import { Sidebar, Folder } from './components/Sidebar'
import { TopBar, SaveTarget } from './components/TopBar'
import { MemoInput } from './components/MemoInput'
import { MemoList } from './components/MemoList'
import styles from './App.module.css'

export default function App() {
  const { memos, addMemo, updateMemo, deleteMemo, filterMemos, countFor } = useMemos()
  const { categories, addCategory, removeCategory, getCategoryDef } = useCategories()

  const [folder, setFolder] = useState<Folder>('all')
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [saveTarget, setSaveTarget] = useState<SaveTarget>('auto')

  const counts: Record<string, number> = {
    all: countFor('all'),
    important: countFor('important'),
    pinned: countFor('pinned'),
    ...Object.fromEntries(categories.map((c) => [c.id, countFor(c.id)])),
  }

  const visible = filterMemos(folder, activeQuery)

  const handleSave = (text: string) => {
    addMemo(text, saveTarget === 'auto' ? undefined : saveTarget)
  }

  const handleFolderSelect = (f: Folder) => {
    setFolder(f)
    setActiveQuery('')
    setQuery('')
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
        <MemoInput saveTarget={saveTarget} onSave={handleSave} />
        <MemoList
          memos={visible}
          categories={categories}
          getCategoryDef={getCategoryDef}
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
        />
      </main>
    </div>
  )
}
