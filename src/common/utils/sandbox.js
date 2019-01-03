import axios from 'axios'
import moment from 'moment'
import { Observable } from 'rxjs'
import units from 'ethereumjs-units'
import TestEngine from './testEngine'
import { BigNumber } from 'bignumber.js'
import { TYPES, covertMessage } from './message'
import plugin, { pluginName } from '../../libraries/babel-plugin-convert-call'

const babel = require('@babel/standalone')
const sanboxEngine = require('../../libraries/sandbox-core-engine')
const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const assert = chai.assert

const DEFAULT_PRESETS = [
  'es2017',
  ['stage-0', { legacy: false, decoratorsBeforeExport: true }]
]
const DEFAULT_PLUGINS = [
  'transform-spread',
  'transform-classes',
  'transform-block-scoping',
  'proposal-function-bind',
  'transform-arrow-functions',
  'proposal-class-properties',
  'transform-async-to-generator',
  'proposal-object-rest-spread',
  'proposal-export-default-from',
  'transform-block-scoped-functions',
  'proposal-async-generator-functions',
  pluginName
]
// Javascript sanbox required for exec the javascript code without threatened main application
export default class Sandbox {
  constructor (global, variables, presets = undefined, plugins = undefined) {
    this.presets = presets || DEFAULT_PRESETS
    this.plugins = plugins || DEFAULT_PLUGINS
    this.variables = variables

    this.responseObserver = null
    this.responseSubscription = null
    // Make a generator function for response result
    this.responseObservable = new Observable((observer) => {
      this.responseObserver = observer
    })
    this.testEngine = new TestEngine()
    this.global = this.prepareGlobalObjects(global || {})
    babel.registerPlugin(pluginName, plugin)
  }
  prepareGlobalObjects (inputs) {
    return {
      // Type
      String,
      Object,
      Array,
      Number,
      Date,
      Error,
      // Global function
      JSON,
      Symbol,
      Promise,
      Math,
      RegExp,
      ...this.customGlobalObjects(),
      ...inputs
    }
  }
  exec (source, callbacks = {}) {
    try {
      source = `
      async function main () {
        ${source}
      }
      main()
      `
      const result = babel.transform(source, {
        presets: this.presets,
        plugins: this.plugins
      }).code
      if (this.responseSubscription) {
        this.responseSubscription.unsubscribe()
      }
      this.responseSubscription = this.responseObservable.subscribe({
        next: callbacks.onMessage || undefined,
        error: callbacks.onError || undefined,
        complete: this.processComplete
      })
      const code = sanboxEngine.compileSanbox(result)
      const resultExcuse = code(
        { ...this.global, window: this.global },
        this.variables || {}
      )
      if (resultExcuse) {
        this.sendOutput(TYPES.execuse_result, resultExcuse)
      }
    } catch (err) {
      return this.createOutput(TYPES.execuse_error, err.message)
    }
  }
  createOutput (type, message) {
    return {
      type,
      message: covertMessage(type, message)
    }
  }
  sendOutput (type, message) {
    this.responseObserver && this.responseObserver.next(this.createOutput(type, message))
  }
  processComplete () {
    this.responseSubscription && this.responseSubscription.unsubscribe()
    this.responseSubscription = null
  }
  customGlobalObjects () {
    return {
      units,
      moment,
      expect,
      should,
      assert,
      BigNumber,
      fetch: axios,
      $test: this.testEngine,
      $result: this.testEngine.cases,
      clearInterval: (item) => {
        clearInterval(item)
      },
      setInterval: (func, time) => {
        setInterval(func, time)
      },
      clearTimeout: (item) => {
        clearTimeout(item)
      },
      setTimeout: (func, time) => {
        setTimeout(func, time)
      },
      $complete: () => {
        this.responseObserver && this.responseObserver.complete()
      },
      console: {
        native: (message) => {
          console.log('---------COMPILER-LOG---------')
          console.log(message)
          console.log('------------------------------')
        },
        log: (message) => {
          let type = TYPES.text
          if (typeof message !== 'string') {
            type = TYPES.other
          }
          this.sendOutput(type, message)
        },
        table: (message) => {
          this.sendOutput(TYPES.table, message)
        }
      },
      it: (name, callback) => this.testEngine.it(name, callback),
      test: (name, callback) => this.testEngine.it(name, callback),
      describe: (name, callback) => {
        return this.testEngine.describe(
          name,
          callback,
          (message) => this.sendOutput(TYPES.testcase, message)
        )
      },
      suite: (name, callback) => {
        return this.testEngine.describe(
          name,
          callback,
          (message) => this.sendOutput(TYPES.testcase, message)
        )
      }
    }
  }
}
