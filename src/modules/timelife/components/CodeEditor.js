import React from 'react'
import 'brace'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import AceEditor from 'react-ace'
import {
  Button
} from 'antd'

class CodeEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      code: ''
    }
    this.factory = null
    this.compiler = null
    this.onCompile = this.onCompile.bind(this)
    this.onChangeCode = this.onChangeCode.bind(this)
  }
  componentDidMount () {
    const { project, createFactory, createSanboxCompiler } = this.props
    this.factory = createFactory(project)
    this.compiler = createSanboxCompiler(this.factory)
  }
  onCompile () {
    const { code } = this.state
    const { compileSource } = this.props
    compileSource(code, this.compiler)
  }
  onChangeCode (code) {
    this.setState({
      code
    })
  }
  render () {
    const { code } = this.state
    return (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          <AceEditor
            value={code}
            mode='javascript'
            theme='monokai'
            name='CODE_EDITOR'
            onChange={this.onChangeCode}
            editorProps={{
              $blockScrolling: 'Infinity'
            }}
            setOptions={{
              enableLiveAutocompletion: true,
              enableBasicAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true
            }}
            style={{
              width: '100%',
              height: 460
            }}
          />
        </div>
        <Button
          style={{ height: 40, marginTop: 5 }}
          title='Compile'
          color='primary'
          onClick={this.onCompile} />
      </div>
    )
  }
}

export default CodeEditor
