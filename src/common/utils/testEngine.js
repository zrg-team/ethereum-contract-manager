export default class TestEngine {
  constructor () {
    this.cases = {}
    this.suites = []
    this.suiteGroup = null
  }
  async describe (suiteName, functions) {
    const key = new Date().getTime()
    this.suiteGroup = key
    this.suites.push({ key, name: suiteName })
    functions(suiteName, key)
    if (this.cases[key]) {
      const length = this.cases[key].length
      for (let i = 0; i < length; i++) {
        let result = { result: true }
        try {
          await this.cases[key][i].callback()
        } catch (error) {
          result = { result: false, ...error }
        }
        this.cases[key][i] = { ...this.cases[key][i], ...result }
      }
    }
  }
  it (caseName, callback) {
    const key = new Date().getTime()
    if (!this.cases[this.suiteGroup]) {
      this.cases[this.suiteGroup] = []
    }
    this.cases[this.suiteGroup].push({ key, name: caseName, callback })
  }
}
