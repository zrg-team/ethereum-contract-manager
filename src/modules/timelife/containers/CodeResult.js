import { connect } from 'react-redux'
import CodeResult from '../components/CodeResult'
import { MODULE_NAME as MODULE_TIMELIFE } from '../model'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => ({
  outputs: state[MODULE_TIMELIFE].outputs
})

export default connect(mapStateToProps, mapDispatchToProps)(CodeResult)
