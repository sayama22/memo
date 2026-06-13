import { useState } from 'react'
import { useMemos } from './hooks/useMemos'
import { Sidebar, Folder } from './components/Sidebar'
import { TopBar, SaveTarget } from './components/TopBar'
import { MemoInput } from './components/MemoInput'
import { MemoList } from './components/MemoList'
import styles from './App.module.css'
import { Category } from './types'

const ALL_FOLDERS: Folder[] = ['all', 'important', 'pinned', 'work', 'private', 'idea', 'todo', 'other']

export default function App() {
  const { memos, addMemo, updateMemo, deleteMemo, filterMemos, countFor } = useMemos()
  const [folder, setFolder] = useState<Folder>('all')
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [saveTarget, setSaveTarget] = useState<SaveTarget>('auto')

  const counts = Object.fromEntries(
    ALL_FOLDERS.map((f) => [f, countFor(f as Parameters<typeof countFor>[0])])
  ) as Record<Folder, number>

  const visible = filterMemos(
    folder as 'all' | 'important' | 'pinned' | Category,
    activeQuery,
  )

  const handleSave = (text: string) => {
    addMemo(text, saveTarget === 'auto' ? undefined : saveTarget as Category)
  }

  const handleFolderSelect = (f: Folder) => {
    setFolder(f)
    setActiveQuery('')
    setQuery('')
  }

  return (
    <div className={styles.app}>
      <Sidebar selected={folder} counts={counts} onSelect={handleFolderSelect} />
      <main className={styles.main}>
        <TopBar
          query={query}
          saveTarget={saveTarget}
          onQuery={setQuery}
          onSearch={() => setActiveQuery(query)}
          onSaveTarget={setSaveTarget}
        />
        <MemoInput saveTarget={saveTarget} onSave={handleSave} />
        <MemoList
          memos={visible}
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
