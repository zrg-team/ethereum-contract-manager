import { connect } from 'react-redux'
import CodeResult from '../components/CodeResult'
import { MODULE_NAME as MODULE_COMPILER } from '../model'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => ({
  outputs: state[MODULE_COMPILER].outputs,
  runtime: state[MODULE_COMPILER].runtime
})

export default connect(mapStateToProps, mapDispatchToProps)(CodeResult)
