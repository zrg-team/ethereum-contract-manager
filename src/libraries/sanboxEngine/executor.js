// Why using new Function
// It evaluates the passed code just once.
// Calling the returned function will run the code without re-evaluating it.
// It doesn't have access to local closure variables, however, it can still access the global scope.
// Why with
// The code inside a with block tries to retrieve variables from the passed sandbox object first,
// but if it doesn't find it there, it looks for the variable in the closure and global scope.
// Closure scope access is prevented by new Function() so we only have to worry about the global scope.

export function executorExpression (src) {
  return new Function( // eslint-disable-line
    'context',
    'tempVars',
    `const sandbox = $engineCompileToSandbox(context, tempVars)
    try {
      with (sandbox) {
        return ${src}
      }
    } catch (err) {
      if (!(err instanceof TypeError)) {
        throw err
      }
    }
    $engineClearSandbox()`
  )
}

export function executorCode (src, isAsync) {
  if (isAsync) {
    // AsyncFunction is not common
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
    return new AsyncFunction( // eslint-disable-line
      'context',
      'tempVars',
      `const sandbox = $engineCompileToSandbox(context, tempVars)
      with (sandbox) {
        ${src}
      }
      $engineClearSandbox()`
    )
  }
  return new Function( // eslint-disable-line
    'context',
    'tempVars',
    `const sandbox = $engineCompileToSandbox(context, tempVars)
    with (sandbox) {
      ${src}
    }
    $engineClearSandbox()`
  )
}
