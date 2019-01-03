// Add execute function to global object
// Because we want to call it in excutor
let temp
let globalObj
const globals = new Set()

if (typeof window !== 'undefined') {
  globalObj = window
} else if (typeof global !== 'undefined') {
  globalObj = global
} else if (typeof self !== 'undefined') { // eslint-disable-line
  globalObj = self // eslint-disable-line
}
globalObj.$engineCompileToSandbox = engineCompileToSandbox
globalObj.$engineClearSandbox = engineClearSandbox

export function expose (...globalNames) {
  for (let globalName of globalNames) {
    globals.add(globalName)
  }
}

export function hide (...globalNames) {
  for (let globalName of globalNames) {
    globals.delete(globalName)
  }
}

export function hideAll () {
  globals.clear()
}

// variable in sandbox will always evaluate to true because the has trap always returns true.
// The code inside the with block will never try to access the global object.
function has (target, key) {
  return globals.has(key) ? (key in target) : true
}

// Using temp variable you can dynamic change inputs value
function get (target, key) {
  if (key === Symbol.unscopables) {
    return undefined
  }
  return temp && temp[key] ? temp[key] : target[key]
}

const hasHandler = { has }
const allHandlers = { has, get }

// An ES6 Proxy wraps an object and defines trap functions,
// which may intercept fundamental operations on that object.
function engineCompileToSandbox (obj, tempVars) {
  if (tempVars) {
    temp = tempVars
    return new Proxy(obj, allHandlers)
  }
  return new Proxy(obj, hasHandler)
}

function engineClearSandbox () {
  temp = undefined
}
