
import {
  getNonce,
  submitFunctionTransaction
} from './apis'
import web3 from './utils/web3'
import { Contract } from './contract'
import { Account } from './account'

export class ProjectFactory {
  constructor (project) {
    this.project = project
    this.contracts = {}
    this.accounts = {}
    this.prepareAccount()
    this.prepareContract()
  }
  prepareContract () {
    this.contracts = this.project.contracts.reduce((all, item) => {
      return { ...all, [item.name]: new Contract(item) }
    }, {})
  }
  prepareAccount () {
    this.accounts = this.project.accounts.reduce((all, item) => {
      return { ...all, [item.name]: new Account(item) }
    }, {})
  }
  contract (name) {
    try {
      return this.contracts[name]
    } catch (err) {
      return undefined
    }
  }
  async view (name, functionName, inputs) {
    try {
      const contract = this.contracts[name]
      const view = contract.getView(functionName)
      if (view) {
        return contract.fetchViewData({
          name: functionName,
          params: view.inputs,
          outputs: view.outputs,
          inputs
        })
      }
    } catch (err) {
      return undefined
    }
  }
  async getNonceAddress (address) {
    try {
      let nonce = null
      if (this.project.general.fullnode) {
        return web3.getNonceUsingFullnode(address)
      }
      nonce = await getNonce(this.project, address)
      return nonce
    } catch (err) {
      console.error('error', err)
      return undefined
    }
  }
  async submitFunctionTransaction (raw) {
    try {
      let response = null
      if (this.project.general.fullnode && !this.project.general.transactionUrl) {
        response = await web3.sendRawTransactionUsingFullnode(raw)
      } else {
        response = await submitFunctionTransaction(this.project, raw)
      }
      return response
    } catch (err) {
      console.error('error', err)
      return null
    }
  }
}
