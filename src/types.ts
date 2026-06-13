export type Category = 'work' | 'private' | 'idea' | 'todo' | 'other'

export interface Memo {
  id: string
  content: string
  category: Category
  important: boolean
  pinned: boolean
  createdAt: number
}
