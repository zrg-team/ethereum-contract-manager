import { connect } from 'react-redux'
import Account from '../components/Account'
import web3 from '../../../common/utils/web3'
import { fromWei } from '../../../common/utils/format'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/model'

const mapDispatchToProps = (dispatch, props) => ({
  getAllBalance: async (accounts) => {
    try {
      const balances = accounts.reduce((all, account) => {
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
  return {
    accounts: currentProject.accounts || []
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
