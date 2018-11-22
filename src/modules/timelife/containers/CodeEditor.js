import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor'
import Compiler from '../../../common/utils/compiler'
import { setOutput, appendOutput } from '../actions'
import { ProjectFactory } from '../../../libraries/projectSDK'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/model'

const mapDispatchToProps = (dispatch, props) => ({
  compileSource: async (code, compiler) => {
    dispatch(setOutput([]))
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
  },
  createFactory: (project) => {
    return new ProjectFactory(project)
  },
  createSanboxCompiler: (factory) => {
    return new Compiler({ factory, contracts: factory.contracts, accounts: factory.accounts })
  }
})

const mapStateToProps = state => ({
  project: state[MODULE_DASHBOARD].currentProject
})

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor)
