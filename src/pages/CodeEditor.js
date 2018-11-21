import React from 'react'
import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/javascript'
import 'brace/theme/monokai'

class CodeEditor extends React.Component {
  render () {
    return (
      <AceEditor
        mode='javascript'
        theme='monokai'
        name='CODE_EDITOR'
        editorProps={{
          $blockScrolling: false
        }}
        setOptions={{
          enableSnippets: false,
          showLineNumbers: true
        }}
      />
    )
  }
}

export default CodeEditor
