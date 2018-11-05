import { connect } from 'react-redux'
import GenerateTransaction from '../components/GenerateTransaction'
import { getDataSmartContract, createTransaction } from '../../../common/utils/ethereum'

const mapDispatchToProps = (dispatch, props) => ({
  generateTransactionHex: async (params) => {
    try {
      const raw = createTransaction(params)
      return raw
    } catch (err) {
      console.error('error', err)
      return null
    }
  },
  convertTransactionData: ({ functionName, typeParams, params }) => {
    return getDataSmartContract({
      functionName,
      typeParams,
      params
    })
  }
})

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateTransaction)
