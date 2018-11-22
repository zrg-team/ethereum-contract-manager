import {
  createTransaction
} from './utils/ethereum'

export class Account {
  constructor (contract) {
    this.address = contract.address
    this.name = contract.name
    this.privateKey = contract.privateKey
  }
  createRawTransaction (params) {
    try {
      const raw = createTransaction(params)
      return raw
    } catch (err) {
      console.error('error', err)
      return undefined
    }
  }
}
