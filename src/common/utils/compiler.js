import axios from 'axios'
import moment from 'moment'
import units from 'ethereumjs-units'
import { BigNumber } from 'bignumber.js'
import { Observable } from 'rxjs'
import { TYPES, covertMessage } from './message'

const babel = require('@babel/standalone')
const sanboxEngine = require('../../libraries/sanboxEngine')

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
  'proposal-async-generator-functions'
]
// Javascript sanbox required for exec the javascript code without threatened main application
export default class Compiler {
  constructor (global, presets = undefined, plugins = undefined) {
    this.presets = presets || DEFAULT_PRESETS
    this.plugins = plugins || DEFAULT_PLUGINS

    this.responseObserver = null
    this.responseSubscription = null
    // Make a generator function for response result
    this.responseObservable = Observable.create((observer) => {
      this.responseObserver = observer
    })

    this.global = this.prepareGlobalObjects(global || {})
    // Currently not need
    // this.outputs = {}
  }
  prepareGlobalObjects (inputs) {
    return {
      // Type
      String,
      Object,
      Array,
      Number,
      Date,
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
      const resultExcuse = code(this.global)
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
      BigNumber,
      fetch: axios,
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
        }
      }
    }
  }
}
