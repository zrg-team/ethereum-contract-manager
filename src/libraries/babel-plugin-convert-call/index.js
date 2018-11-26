export const pluginName = 'babel-plugin-convert-call'

// Call identifier function auto bind global "this"
// Fixed by: convert identifier call with .call with custom "this"
export default function plugin ({ types }) {
  return {
    visitor: {
      CallExpression (path, state) {
        // Only apply for identifier function, member expression ignored
        if (path.node.callee && types.isIdentifier(path.node.callee)) {
          const node = path.node
          const inputs = node.arguments
          // In core-sandbox-engine variable "window" is global cope
          path.replaceWith(
            types.callExpression(
              types.memberExpression(node.callee, types.identifier('call')),
              [types.identifier('window'), ...inputs]
            )
          )
        }
      }
    }
  }
}
