import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor'
import Compiler from '../../../common/utils/compiler'
import { setOutput, appendOutput } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  compileSource: async (code) => {
    dispatch(setOutput([]))
    const compiler = new Compiler({})
    const error = compiler.exec(code, {
      onMessage: (message) => {
        console.log('message', message)
        dispatch(appendOutput(message))
      }
    })
    console.log('error', error)
    if (error) {
      dispatch(appendOutput(error))
    }
  }
})

const mapStateToProps = state => ({})

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor)
