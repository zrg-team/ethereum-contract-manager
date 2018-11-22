import {
  createTransaction
} from './utils/ethereum'

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
  createRawTransaction (params) {
    try {
      const raw = createTransaction(params)
      return raw
    } catch (err) {
      console.error('error', err)
      return undefined
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
