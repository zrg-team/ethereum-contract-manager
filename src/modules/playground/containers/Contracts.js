import { connect } from 'react-redux'
import Contracts from '../components/Contracts'
import web3 from '../../../common/utils/web3'
import { fromWei } from '../../../common/utils/format'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/model'

const mapDispatchToProps = (dispatch, props) => ({
  getAllBalance: async (contracts) => {
    try {
      const balances = contracts.reduce((all, account) => {
        const balance = web3.getBalance(account.address)
        return { ...all, [account.address]: fromWei(balance.toFixed(), 'eth') }
      }, {})
      return balances
    } catch (err) {
      console.error('getAllBalance', err)
      return null
    }
  }
})

const mapStateToProps = state => {
  const currentProject = state[MODULE_DASHBOARD].currentProject || {}
  console.log('>>>>>>', currentProject, currentProject.contracts)
  return {
    contracts: currentProject.contracts || []
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contracts)
