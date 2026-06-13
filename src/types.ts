export type Category = string

export interface CategoryDef {
  id: string
  label: string
  icon: string
  colors: { bg: string; text: string; border: string }
  builtin?: boolean
}

export interface Memo {
  id: string
  content: string
  category: Category
  important: boolean
  pinned: boolean
  createdAt: number
  completed: boolean
}
