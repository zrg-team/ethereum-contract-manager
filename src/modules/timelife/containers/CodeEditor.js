import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor'
import Sandbox from '../../../common/utils/sandbox'
import { setOutput, appendOutput } from '../actions'
import { store } from '../../../common/utils/database'
import { descrypt } from '../../../common/utils/encrypt'
import { ProjectFactory } from '../../../libraries/project-factory'
import { MODULE_NAME as MODULE_PROJECT } from '../../project/model'

const mapDispatchToProps = (dispatch, props) => ({
  compileSource: async (code, compiler) => {
    dispatch(setOutput([]))
    // Clear last status
    if (compiler && compiler.global && compiler.global.factory) {
      compiler.global.factory.reset()
      compiler.global.factory.process()
    }
    const error = compiler.exec(code, {
      onMessage: (message) => {
        dispatch(appendOutput(message))
      }
    })
    if (error) {
      dispatch(appendOutput(error))
    }
  },
  createFactory: (project) => {
    const factory = new ProjectFactory(project)
    factory.init()
    return factory
  },
  createSanboxCompiler: (factory) => {
    if (factory) {
      return new Sandbox({
        $factory: factory,
        view: (params) => factory.view(params),
        submit: (params) => factory.submit(params),
        project: factory.project,
        accounts: factory.accounts,
        subscribers: factory.subscribers,
        awaitResult: factory.awaitResult,
        transactions: factory.transactions,
        responseObservable: factory.responseObservable,
        ...factory.contracts
      })
    }
    return new Sandbox({})
  },
  getProjectRuntime: async (item, password) => {
    try {
      const data = await store.getItem(`project_${item.key}`)
      let scripts = null
      if (password) {
        scripts = JSON.parse(descrypt(data.encrypted, password))
        delete data.encrypted
      }
      return {
        ...data,
        ...scripts
      }
    } catch (err) {
      console.error('err', err)
      return false
    }
  }
})

const mapStateToProps = state => ({
  projects: state[MODULE_PROJECT].projects
})

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor)
