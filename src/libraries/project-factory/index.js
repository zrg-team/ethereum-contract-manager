import { Subject } from 'rxjs'
import { Contract } from './contract'
import { Account } from './account'
import {
  getTransactionReceipt
} from './utils/apis'
import web3 from './utils/web3'

export class ProjectFactory {
  constructor (project) {
    this.project = project
    this.contracts = {}
    this.accounts = {}
    this.prepareAccount()
    this.prepareContract()
    this.transactions = []
    this.subscribers = []
    this.processIntance = null
    this.web3 = null
  }
  async init () {
    this.responseSubject = new Subject()
    await this.process()
    return true
  }
  reset () {
    try {
      this.transactions = []
      Object.keys(this.subscribers).forEach(key => {
        this.subscribers[key] && this.subscribers[key].unsubscribe()
      })
      this.subscribers = []
    } catch (err) {
      this.transactions = []
      this.subscribers = []
    }
  }
  async process () {
    if (this.project.general && this.project.general.fullnode) {
      if (this.processTimeout) {
        this.processTimeout.stopWatching()
        this.processTimeout = null
      }
      this.web3 = await web3.init(this.project.general.fullnode)
      const blockNumber = web3.getCurrentBlock()
      this.processTimeout = web3.newBlockListener((data) => {
        if (this.transactions.includes(data.transactionHash)) {
          this.responseSubject.next(data)
        }
      }, undefined, blockNumber)
    } else {
      if (this.processTimeout) {
        clearTimeout(this.processTimeout)
        this.processTimeout = null
      }
      this.processTimeout = setTimeout(() => this.checkTransaction(this.process), 10000)
    }
  }
  async checkTransaction () {
    try {
      const results = await Promise.all(this.transactions.map(async transaction => {
        const result = await getTransactionReceipt(this.project, transaction)
        if (result && !result.error) {
          this.responseSubject.next(result)
          return null
        } else if (result && result.message === 'INVALID_RETURN_PATH') {
          return transaction
        } else {
          this.responseSubject.error({
            data: { transactionHash: transaction },
            error: result.message
          })
          return undefined
        }
      }))
      this.transactions = results.filter(item => item)
    } catch (error) {
    }
    this.process()
  }
  prepareContract () {
    this.contracts = this.project.contracts && this.project.contracts.reduce((all, item) => {
      return { ...all, [item.key]: new Contract(item) }
    }, {})
  }
  prepareAccount () {
    this.accounts = this.project.accounts && this.project.accounts.reduce((all, item) => {
      return { ...all, [item.key]: new Account(item) }
    }, {})
  }
  contract (name) {
    try {
      return this.contracts[name]
    } catch (err) {
      return undefined
    }
  }
  view ({
    inputs,
    contract,
    functionName
  }) {
    try {
      if (typeof contract === 'string') {
        contract = this.contracts[contract]
      }
      return contract.view(this.project, {
        inputs,
        functionName
      })
    } catch (err) {
      return undefined
    }
  }
  viewContract (contract, functionName, inputs) {
    return this.view({
      inputs,
      contract,
      functionName
    })
  }
  async submit ({
    inputs,
    account,
    contract,
    valueSend,
    functionName
  }) {
    try {
      if (typeof contract === 'string') {
        contract = this.contracts[contract]
      }
      if (typeof account === 'string') {
        account = this.accounts[account]
      }
      const transaction = await account.submit(this.project, {
        inputs,
        contract,
        valueSend,
        functionName
      })
      if (transaction) {
        this.transactions.push(transaction)
        return this.awaitResult(transaction)
      }
      throw new Error('INVALID_RETURN')
    } catch (err) {
    }
  }
  async submitAsync ({
    inputs,
    account,
    contract,
    valueSend,
    functionName
  }) {
    try {
      if (typeof contract === 'string') {
        contract = this.contracts[contract]
      }
      if (typeof account === 'string') {
        account = this.accounts[account]
      }
      const transaction = await account.submit(this.project, {
        inputs,
        contract,
        valueSend,
        functionName
      })
      if (transaction) {
        return transaction
      }
      throw new Error('INVALID_RETURN')
    } catch (err) {
    }
  }
  awaitResult (transaction) {
    return new Promise((resolve, reject) => {
      if (!this.transactions.length) {
        throw new Error('TRANSACTION_MISSING')
      }
      const timeout = setTimeout(() => {
        reject(new Error('TIMEOUT'))
      }, 60000)
      const key = new Date().getTime()
      const subscriber = this.responseSubject.subscribe(
        (data) => {
          if (transaction !== data.transactionHash) {
            return false
          }
          clearTimeout(timeout)
          subscriber.unsubscribe()
          delete this.subscribers[key]
          resolve(data)
        },
        ({ data, error }) => {
          if (transaction !== data.transactionHash) {
            return false
          }
          clearTimeout(timeout)
          subscriber.unsubscribe()
          delete this.subscribers[key]
          reject(error)
        }
      )
      this.subscribers[key] = subscriber
    })
  }
  submitContract (contract, functionName, inputs, account, valueSend) {
    return this.submit({
      inputs,
      account,
      contract,
      valueSend,
      functionName
    }).then(async transaction => {
      this.transactions.push(transaction)
      return this.awaitResult(transaction)
    })
  }
}
