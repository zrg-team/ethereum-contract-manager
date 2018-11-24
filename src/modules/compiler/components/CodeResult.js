import React from 'react'
const ReactMarkdown = require('react-markdown/with-html')

class CodeResult extends React.Component {
  render () {
    const { outputs } = this.props
    let markdown = `
## RESULT
`
    outputs && outputs.forEach(item => {
      markdown += `
${item.message}\n`
    })
    return (
      <div style={{ flex: 1, overflowY: 'auto', height: '100%', paddingLeft: 10 }}>
        <ReactMarkdown
          skipHtml={false}
          rawSourcePos={false}
          sourcePos={false}
          escapeHtml={false}
          source={`
${markdown}
`}
        />
      </div>
    )
  }
}

export default CodeResult
