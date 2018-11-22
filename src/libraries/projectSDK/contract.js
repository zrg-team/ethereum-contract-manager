import {
  mapHexToOutput,
  parseTransactionParams
} from './utils/ethereum'
import {
  getNonce,
  getContractView,
  submitFunctionTransaction
} from '../repository'
import web3 from './utils/web3'

export class Contract {
  constructor (contract, fullnode = false) {
    this.address = contract.address
    this.abi = contract.address
    this.name = contract.name
    this.fullnode = fullnode || false
    const parsed = this.parseAbi()
    this.functions = parsed.functions
    this.events = parsed.events
    this.views = parsed.views
  }
  async excuseView (data, project) {
    try {
      data.params = data.params.map((item, index) => {
        const type = data.inputs[index]
        const parsed = parseTransactionParams({ type, value: item })
        return parsed.value
      })
      const response = await getContractView(project, data)
      return mapHexToOutput(response, data.outputs)
    } catch (err) {
      return undefined
    }
  }
  async excuseFunction (data, project, raw) {
    try {
      let response = null
      if (this.fullnode && !project.general.transactionUrl) {
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
  parseAbi () {
    return this.abi.reduce((all, item) => {
      if (item.type === 'event') {
        all.events.push({
          ...item,
          ourType: 'event'
        })
      } else if (item.stateMutability === 'payable' || item.payable || item.stateMutability === 'nonpayable') {
        all.functions.push({
          ...item,
          ourType: 'function'
        })
      } else {
        all.views.push({
          ...item,
          ourType: 'view'
        })
      }
      return {
        events: [
          ...all.events
        ],
        functions: [
          ...all.functions
        ],
        views: [
          ...all.views
        ]
      }
    }, {
      functions: [],
      events: [],
      views: []
    })
  }
}
