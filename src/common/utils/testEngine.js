export default class TestEngine {
  constructor () {
    this.cases = {}
    this.suites = {}
    this.currentSuite = null
  }
  async describe (suiteName, functions, resultCallback) {
    const key = new Date().getTime()
    this.currentSuite = key
    this.suites[key] = { name: suiteName, key }
    functions.call({ suiteKey: key }, suiteName, key)
    if (this.cases[key]) {
      const length = this.cases[key].length
      this.suites[key].before && this.suites[key].before()
      for (let i = 0; i < length; i++) {
        const caseStart = new Date().getTime()
        let result = { result: true }
        try {
          this.suites[key].beforeEach && this.suites[key].beforeEach()
          await this.cases[key][i].callback()
        } catch (error) {
          result = { result: false, ...error, message: error.message }
        }
        const caseEnd = new Date().getTime()
        this.cases[key][i] = { ...this.cases[key][i], ...result, time: +caseEnd - +caseStart }
        this.suites[key].afterEach && this.suites[key].afterEach(this.cases[key][i])
      }
      this.suites[key].after && this.suites[key].after()
    } else {
      this.cases[key] = []
    }
    this.currentSuite = null
    const suiteEnd = new Date().getTime()
    resultCallback({ name: suiteName, cases: [ ...this.cases[key] ], time: +suiteEnd - +key })
    delete this.cases[key]
  }
  it (caseName, callback) {
    const key = new Date().getTime()
    if (!this.cases[this.currentSuite]) {
      this.cases[this.currentSuite] = []
    }
    this.cases[this.currentSuite].push({ key, name: caseName, callback })
  }
  before (callback) {
    this.suites[this.currentSuite].before = callback
  }
  after (callback) {
    this.suites[this.currentSuite].after = callback
  }
  beforeEach (callback) {
    this.suites[this.currentSuite].beforeEach = callback
  }
  afterEach (callback) {
    this.suites[this.currentSuite].afterEach = callback
  }
}
