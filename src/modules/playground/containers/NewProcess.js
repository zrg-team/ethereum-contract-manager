import { connect } from 'react-redux'
import NewProcess from '../components/NewProcess'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/model'
import {
  getContractView,
  submitFunctionTransaction,
  getNonce
} from '../repository'
import { addTransaction } from '../../project/actions'
import { stopFullnodeProcess } from '../../playground/actions'
import { mapHexToOutput, createTransaction, parseTransactionParams } from '../../../common/utils/ethereum'
import web3 from '../../../common/utils/web3'

export const mapDispatchToProps = (dispatch, props) => ({
  parseAbi: (data) => {
    return data.reduce((all, item) => {
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
  },
  fetchViewData: async (project, data) => {
    try {
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
  },
  getNonceAddress: async (project, data) => {
    try {
      let nonce = null
      if (project.general.fullnode) {
        return web3.getNonceUsingFullnode(data.account.address)
      }
      nonce = await getNonce(project, data.account.address)
      return nonce
    } catch (err) {
      console.error('error', err)
      return undefined
    }
  },
  createRawTransaction: (params) => {
    try {
      const raw = createTransaction(params)
      return raw
    } catch (err) {
      console.error('error', err)
      return undefined
    }
  },
  submitFunctionTransaction: async (project, data, raw) => {
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
  },
  repareContracts: (project) => {
    try {
      web3.connectToContracts(project.contracts)
    } catch (err) {
      return {}
    }
  },
  submitTimelife: (transactionId, project, data) => {
    dispatch(addTransaction({
      key: project.key,
      data: [{
        transactionId,
        ...data
      }]
    }))
  },
  stopPlayground: () => {
    dispatch(stopFullnodeProcess())
  }
})

const mapStateToProps = state => {
  return {
    currentProject: state[MODULE_DASHBOARD].currentProject
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewProcess)
