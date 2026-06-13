const DB_NAME = 'memo-image-store'
const STORE = 'images'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function dbPut(id: string, dataUrl: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(dataUrl, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function dbGet(id: string): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(id)
    req.onsuccess = () => resolve((req.result as string) ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function dbDelete(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function dbGetAll(): Promise<[string, string][]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const results: [string, string][] = []
    const tx = db.transaction(STORE)
    const store = tx.objectStore(STORE)
    const keysReq = store.getAllKeys()
    keysReq.onsuccess = () => {
      const keys = keysReq.result as string[]
      const valsReq = store.getAll()
      valsReq.onsuccess = () => {
        const vals = valsReq.result as string[]
        keys.forEach((k, i) => results.push([k, vals[i]]))
        resolve(results)
      }
      valsReq.onerror = () => reject(valsReq.error)
    }
    keysReq.onerror = () => reject(keysReq.error)
  })
}
