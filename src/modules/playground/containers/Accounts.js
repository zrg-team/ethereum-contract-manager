import { connect } from 'react-redux'
import Accounts from '../components/Accounts'
import web3 from '../../../common/utils/web3'
import { fromWei } from '../../../common/utils/format'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/model'

const mapDispatchToProps = (dispatch, props) => ({
  getAllBalance: async (accounts) => {
    try {
      const balances = accounts.reduce((all, account) => {
        let balance = 0
        try {
          balance = web3.getBalance(account.address)
        } catch (err) {
        }
        return { ...all, [account.address]: fromWei(balance.toFixed(), 'eth') }
      }, {})
      return balances
    } catch (err) {
      return null
    }
  }
})

const mapStateToProps = state => {
  const currentProject = state[MODULE_DASHBOARD].currentProject || {}
  return {
    accounts: currentProject.accounts || []
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts)
