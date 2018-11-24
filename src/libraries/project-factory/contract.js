
import {
  mapHexToOutput,
  parseTransactionParams
} from './utils/ethereum'
import {
  getContractView
} from './utils/apis'

export class Contract {
  constructor (contract) {
    this.address = contract.address
    this.abi = contract.abi ? JSON.parse(contract.abi) : []
    this.name = contract.name
    const parsed = this.parseAbi()
    this.functions = parsed.functions
    this.events = parsed.events
    this.views = parsed.views
  }
  getView (name) {
    return this.views.find(item => item.name === name)
  }
  getFunction (name) {
    return this.functions.find(item => item.name === name)
  }
  async view (project, {
    inputs,
    functionName
  }) {
    try {
      const view = this.getView(functionName)
      const data = {
        name: functionName,
        params: inputs,
        address: this.address,
        outputs: view.outputs,
        inputs: view.inputs.map(item => item.type)
      }
      data.params = data.params.map((item, index) => {
        const type = data.inputs[index]
        const parsed = parseTransactionParams({ type, value: item })
        return parsed.value
      })
      const response = await getContractView(project, data)
      return mapHexToOutput(response, data.outputs)
    } catch (err) {
      console.error('error', err)
      return undefined
    }
  }
  async fetchViewData (data) {
    try {
      data.params = data.params.map((item, index) => {
        const type = data.inputs[index]
        const parsed = parseTransactionParams({ type, value: item })
        return parsed.value
      })
      const response = await getContractView(this.project, data)
      return mapHexToOutput(response, data.outputs)
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
