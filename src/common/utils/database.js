const localForage = require('localforage')

localForage.config({
  name: 'qc-contract-manager',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'projects',
  description: 'some description'
})

export const store = localForage.createInstance({
  name: 'projects'
})
