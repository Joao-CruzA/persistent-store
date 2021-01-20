import OpenStore from './src/OpenStore'
import TransactionStore from './src/TransactionStore'

const list = []

class PersistentStore {
  static crateStore (name, verison, collections) {
    const openStore = new OpenStore(name, verison, collections)
    const transactionStore = new TransactionStore(openStore)
    list.push(transactionStore)
  }

  constructor (name) {
    this.name = name
  }

  get transaction () {
    const transaction = list.find(x => x.openStore.name === this.name) || null
    if (!transaction) throw new Error('DataBase NotFound!')
    return transaction
  }

  count (collection) {
    return this.transaction.count(collection)
  }

  clear (collection) {
    return this.transaction.clear(collection)
  }

  get (collection, key) {
    return this.transaction.get(collection, key)
  }

  getAll (collection) {
    return this.transaction.getAll(collection)
  }

  getAllKeys (collection) {
    return this.transaction.getAllKeys(collection)
  }

  add (collection, value) {
    return this.transaction.add(collection, value)
  }

  addMany (collection, data) {
    return this.transaction.addMany(collection, data)
  }

  update (collection, value) {
    return this.transaction.update(collection, value)
  }

  updateMany (collection, data) {
    return this.transaction.updateMany(collection, data)
  }

  delete (collection, key) {
    return this.transaction.delete(collection, key)
  }

  deleteMany (collection, keys) {
    return this.transaction.deleteMany(collection, keys)
  }
}

export default PersistentStore
