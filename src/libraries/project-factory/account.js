import {
  getNonce,
  submitFunctionTransaction
} from './utils/apis'
import {
  createTransaction
} from './utils/ethereum'
import web3 from './utils/web3'

export class Account {
  constructor (account) {
    this.address = account.address
    this.name = account.name
    this.privateKey = account.privateKey
  }
  async submit (project, {
    inputs,
    contract,
    functionName,
    valueSend = 0
  }) {
    try {
      const func = contract.functions.find(item => item.name === functionName)
      const nonce = await this.getNonceAddress(project)
      const params = {
        to: contract.address,
        from: this.address,
        value: Number(valueSend) || 0x0,
        nonce,
        gasLimit: 8000000,
        gasPrice: 20 * 1000000000,
        functionName: func.name,
        privateKey: this.privateKey,
        typeParams: func.inputs.map(item => item.type),
        functionParams: inputs
      }
      const raw = this.createRawTransaction(params)
      return this.submitTransaction(project, raw)
    } catch (err) {
      console.log('submit errorr', err)
      return undefined
    }
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
  async getNonceAddress (project) {
    try {
      let nonce = null
      if (project.general.fullnode) {
        return web3.getNonceUsingFullnode(this.address)
      }
      nonce = await getNonce(project, this.address)
      return nonce
    } catch (err) {
      console.error('error', err)
      return undefined
    }
  }
  async submitTransaction (project, raw) {
    try {
      let response = null
      if (project.general.fullnode && !project.general.transactionUrl) {
        response = await web3.sendRawTransactionUsingFullnode(raw)
      } else {
        response = await submitFunctionTransaction(project, raw)
      }
      return response
    } catch (err) {
      console.error('error', err)
      return null
    }
  }
}
