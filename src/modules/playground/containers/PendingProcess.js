import { connect } from 'react-redux'
import PendingProcess from '../components/PendingProcess'
import { MODULE_NAME as MODULE_PROJECT } from '../../project/model'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/model'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => {
  const currentProject = state[MODULE_DASHBOARD].currentProject
  return {
    transactions: state[MODULE_PROJECT].transactions[currentProject.key] || []
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingProcess)
