import { useState, useEffect, useCallback } from 'react'
import { dbPut, dbDelete, dbGetAll } from '../imageDB'

export function useImageStore() {
  const [images, setImages] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    dbGetAll().then((entries) => setImages(new Map(entries)))
  }, [])

  const addImage = useCallback(async (dataUrl: string): Promise<string> => {
    const id = `img-${Date.now()}-${Math.random().toString(36).slice(2)}`
    await dbPut(id, dataUrl)
    setImages((prev) => new Map(prev).set(id, dataUrl))
    return id
  }, [])

  const removeImage = useCallback(async (id: string) => {
    await dbDelete(id)
    setImages((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  const getImage = useCallback(
    (id: string): string | undefined => images.get(id),
    [images],
  )

  return { images, addImage, removeImage, getImage }
}
