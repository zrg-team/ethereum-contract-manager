import { connect } from 'react-redux'
import PendingProcess from '../components/PendingProcess'
import { MODULE_NAME as MODULE_PROJECT } from '../../project/model'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/model'
import { getTransactionReceipt } from '../repository'
import { setTransactions } from '../../project/actions'

const mapDispatchToProps = (dispatch, props) => ({
  checkTransactionReceipt: async (project, transaction, transactions) => {
    try {
      const response = await getTransactionReceipt(project, transaction.transactionId)
      if (response) {
        let newItem = transaction
        transactions = transactions.map(item => {
          if (item.transactionId === response.transactionHash) {
            if (!item.response) {
              item.response = []
            }
            item.response.push({
              blockNumber: response.blockNumber,
              event: response.logs,
              transactionHash: response.transactionHash,
              transactionIndex: response.transactionIndex,
              blockHash: response.blockHash,
              args: []
            })
            item = { ...item }
            newItem = item
          }
          return item
        })
        dispatch(setTransactions([ ...transactions ]))
        return newItem
      }
      throw new Error('INVALID_RETURN')
    } catch (err) {
      return null
    }
  }
})

const mapStateToProps = state => {
  const currentProject = state[MODULE_DASHBOARD].currentProject
  return {
    currentProject,
    general: currentProject.general,
    transactions: state[MODULE_PROJECT].transactions[currentProject.key] || []
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingProcess)
