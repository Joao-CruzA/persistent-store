export default class OpenStore {
  constructor (name, version, collections) {
    collections = collections || []

    this.db = null
    this.name = name
    this.version = version
    this.collections = collections
    this.openRequest = indexedDB.open(name, version)

    this.openRequest.onsuccess = (event) => {
      this.db = event.target.result
    }

    this.openRequest.onupgradeneeded = (event) => {
      const db = event.target.result

      for (const collection of collections) {
        const name = collection.name
        const key = collection.key
        const increment = !!collection.increment
        if (name && key) {
          if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: key, autoIncrement: increment })
        }
      }
    }

    this.openRequest.onerror = (event) => {
      console.error(event)
    }
  }

  getDb () {
    return new Promise((resolve, reject) => {
      if (this.db) return resolve(this.db)
      const watchId = setInterval(() => {
        if (!this.db) return
        resolve(this.db)
        clearInterval(watchId)
      }, 1)
    })
  }
}
