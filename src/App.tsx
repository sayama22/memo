import { useState } from 'react'
import { useMemos } from './hooks/useMemos'
import { Sidebar, Folder } from './components/Sidebar'
import { TopBar, Period } from './components/TopBar'
import { MemoInput } from './components/MemoInput'
import { MemoList } from './components/MemoList'
import styles from './App.module.css'
import { Category } from './types'

const ALL_FOLDERS: Folder[] = ['all', 'important', 'pinned', 'work', 'private', 'idea', 'todo', 'other']

export default function App() {
  const { memos, addMemo, updateMemo, deleteMemo, filterMemos, countFor } = useMemos()
  const [folder, setFolder] = useState<Folder>('all')
  const [period, setPeriod] = useState<Period>('all')
  const [query, setQuery] = useState('')

  const counts = Object.fromEntries(
    ALL_FOLDERS.map((f) => [f, countFor(f as Parameters<typeof countFor>[0])])
  ) as Record<Folder, number>

  const visible = filterMemos(
    folder as 'all' | 'important' | 'pinned' | Category,
    period,
    query,
  )

  return (
    <div className={styles.app}>
      <Sidebar selected={folder} counts={counts} onSelect={setFolder} />
      <main className={styles.main}>
        <TopBar
          query={query}
          period={period}
          memos={visible}
          onQuery={setQuery}
          onPeriod={setPeriod}
        />
        <MemoInput onSave={addMemo} />
        <MemoList
          memos={visible}
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
