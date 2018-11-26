import { connect } from 'react-redux'
import saveAs from 'file-saver'
import CodeEditor from '../components/CodeEditor'
import Sandbox from '../../../common/utils/sandbox'
import { setRuntime, setOutput, appendOutput } from '../actions'
import { store } from '../../../common/utils/database'
import { descrypt } from '../../../common/utils/encrypt'
import { ProjectFactory } from '../../../libraries/project-factory'
import { MODULE_NAME as MODULE_PROJECT } from '../../project/model'
import { MODULE_NAME as MODULE_COMPILER } from '../model'
import TestEngine from '../../../common/utils/testEngine'
const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const assert = chai.assert

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
    const test = new TestEngine()
    const global = {
      describe: (name, callback) => test.describe(name, callback),
      it: (name, callback) => test.it(name, callback),
      $result: test.cases,
      $test: test,
      expect,
      should,
      assert
    }
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
        ...factory.contracts,
        ...global
      })
    }
    return new Sandbox(global)
  },
  getProjectRuntime: async (item, password) => {
    try {
      const data = await store.getItem(`project_${item.key}`)
      let scripts = null
      if (password) {
        scripts = JSON.parse(descrypt(data.encrypted, password))
        delete data.encrypted
      }
      const runtime = {
        ...data,
        ...scripts
      }
      dispatch(setRuntime(runtime))
      return runtime
    } catch (err) {
      console.error('err', err)
      return false
    }
  },
  saveSourceFile: (code) => {
    const blob = new Blob([`${code}`], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'source.js')
    return true
  }
})

const mapStateToProps = state => ({
  projects: state[MODULE_PROJECT].projects,
  runtime: state[MODULE_COMPILER].runtime
})

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor)
