export const TYPES = {
  text: 'text',
  other: 'other',
  execuse_error: 'execuse_error',
  execuse_result: 'execuse_result'
}

export function covertMessage (type, message) {
  switch (type) {
    case TYPES.other:
      return `
<pre>
${message}
</pre>
`
    case TYPES.execuse_result:
    case TYPES.execuse_error:
      return `
<strong>
<pre>
${message}
</pre>
</strong>
`
    case TYPES.text:
    default:
      return message
  }
}
