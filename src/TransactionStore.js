export default class TransactionStore {
  constructor (openStore) {
    this.openStore = openStore
  }

  transaction (collection, call) {
    if (!collection) throw new Error('Define the collection!')
    return new Promise((resolve, reject) => {
      this.openStore.getDb()
        .then(db => {
          const tx = db.transaction(collection, 'readwrite')
          const store = tx.objectStore(collection)
          call(store, resolve, reject)
        })
    })
  }

  count (collection) {
    return this.transaction(collection, (store, resolve, reject) => {
      const request = store.count()
      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => reject(event.target.error)
    })
  }

  clear (collection) {
    return this.transaction(collection, (store, resolve, reject) => {
      const request = store.clear()
      request.onsuccess = (event) => resolve()
      request.onerror = (event) => reject(event.target.error)
    })
  }

  get (collection, key) {
    return this.transaction(collection, (store, resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = (event) => resolve(event.target.result || null)
      request.onerror = (event) => reject(event.target.error)
    })
  }

  getAll (collection) {
    return this.transaction(collection, (store, resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => reject(event.target.error)
    })
  }

  getAllKeys (collection) {
    return this.transaction(collection, (store, resolve, reject) => {
      const request = store.getAllKeys()
      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => reject(event.target.error)
    })
  }

  add (collection, value) {
    return this.transaction(collection, (store, resolve, reject) => {
      const request = store.add(value)
      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => reject(event.target.error)
    })
  }

  addMany (collection, data) {
    return new Promise((resolve, reject) => {
      Promise.all(data.map(value => this.add(collection, value)))
        .then(keys => resolve(keys))
    })
  }

  update (collection, value) {
    return this.transaction(collection, (store, resolve, reject) => {
      const request = store.put(value)
      request.onsuccess = (event) => resolve()
      request.onerror = (event) => reject(event.target.error)
    })
  }

  updateMany (collection, data) {
    return new Promise((resolve, reject) => {
      Promise.all(data.map(value => this.update(collection, value)))
        .then(() => resolve())
    })
  }

  delete (collection, key) {
    return this.transaction(collection, (store, resolve, reject) => {
      const request = store.delete(key)
      request.onsuccess = (event) => resolve()
      request.onerror = (event) => reject(event.target.error)
    })
  }

  deleteMany (collection, keys) {
    return new Promise((resolve, reject) => {
      Promise.all(keys.map(key => this.delete(collection, key)))
        .then(() => resolve())
    })
  }
}
