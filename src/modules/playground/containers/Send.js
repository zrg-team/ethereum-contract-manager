import { connect } from 'react-redux'
import Send from '../components/Send'
import web3 from '../../../common/utils/web3'
import {
  submitFunctionTransaction,
  getNonce
} from '../repository'
import { mapDispatchToProps as mapDispatchToPropsNewProcess } from '../containers/NewProcess'
import { getDataSmartContract, createTransaction } from '../../../common/utils/ethereum'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/model'

const mapDispatchToProps = (dispatch, props) => ({
  send: async (project, params) => {
    try {
      let response = null
      let nonce = null
      let raw = null
      if (project.general.fullnode) {
        nonce = web3.getNonceUsingFullnode(params.from)
        params.nonce = nonce
        raw = createTransaction(params)
        response = await web3.sendRawTransactionUsingFullnode(raw)
      } else {
        nonce = await getNonce(project, params.from)
        params.nonce = nonce
        raw = createTransaction(params)
        response = await submitFunctionTransaction(project, raw)
      }
      return { response, raw }
    } catch (err) {
      console.log('error', err)
      return null
    }
  },
  convertTransactionData: ({ functionName, typeParams, params }) => {
    return getDataSmartContract({
      functionName,
      typeParams,
      params
    })
  },
  ...mapDispatchToPropsNewProcess(dispatch, props)
})

const mapStateToProps = state => {
  const currentProject = state[MODULE_DASHBOARD].currentProject || {}
  return {
    accounts: currentProject.accounts || [],
    currentProject
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Send)
