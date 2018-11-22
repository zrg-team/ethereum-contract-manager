import { limiters, filters } from './modifiers'
import { executorExpression, executorCode } from './executor'

const filterRegex = /(?:[^\|]|\|\|)+/g
const limiterRegex = /(?:[^&]|&&)+/g
const argsRegex = /\S+/g

export function parseExpression (src) {
  const tokens = src.match(filterRegex)
  if (tokens.length === 1) {
    return executorExpression(tokens[0])
  }

  const expression = {
    exec: executorExpression(tokens[0]),
    filters: []
  }
  for (let i = 1; i < tokens.length; i++) {
    let filterTokens = tokens[i].match(argsRegex)
    const filterName = filterTokens.shift()
    const effect = filters.get(filterName)
    if (!effect) {
      throw new Error(`There is no filter named: ${filterName}.`)
    }
    expression.filters.push({effect, argExpressions: filterTokens.map(executorExpression)})
  }
  return expression
}

// Limiters are functions, which can defer or block code execution
export function parseCode (src, isAsync) {
  const tokens = src.match(limiterRegex)
  if (tokens.length === 1) {
    return executorCode(tokens[0], isAsync)
  }

  const code = {
    exec: executorCode(tokens[0], isAsync),
    limiters: []
  }
  for (let i = 1; i < tokens.length; i++) {
    const limiterTokens = tokens[i].match(argsRegex)
    const limiterName = limiterTokens.shift()
    const effect = limiters.get(limiterName)
    if (!effect) {
      throw new Error(`There is no limiter named: ${limiterName}.`)
    }
    code.limiters.push({effect, argExpressions: limiterTokens.map(executorCode)})
  }
  return code
}
