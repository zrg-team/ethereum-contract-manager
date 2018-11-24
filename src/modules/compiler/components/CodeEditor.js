import React from 'react'
import 'brace'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import AceEditor from 'react-ace'
import {
  Button,
  Select
} from 'antd'
import Modal from '../../../common/components/widgets/Modal'
import ConfirmPassword from '../../../common/components/widgets/ConfirmPassword'

class CodeEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      project: null,
      projectId: null,
      code: `// SELECT RUNTIME FOR START CODING
// TODO: Your code here
`
    }
    this.factory = null
    this.compiler = null
    this.onCompile = this.onCompile.bind(this)
    this.onChangeCode = this.onChangeCode.bind(this)
    this.onChangeRuntime = this.onChangeRuntime.bind(this)
  }
  componentDidMount () {
    const { createSanboxCompiler } = this.props
    this.compiler = createSanboxCompiler()
    this.setState({
      ready: true
    })
  }
  async onChangeRuntime (value) {
    Modal.show(<ConfirmPassword
      ref={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={async (password) => {
        this.setState({
          ready: false
        })
        const { projects, getProjectRuntime, createFactory, createSanboxCompiler } = this.props
        const project = projects.find(item => item.key === value)
        const descrypedProject = await getProjectRuntime(project, password)
        Modal.hide()
        if (descrypedProject && descrypedProject.accounts && descrypedProject.contracts) {
          this.factory = await createFactory(descrypedProject)
          this.compiler = createSanboxCompiler(this.factory)
          return this.setState({
            ready: true,
            projectId: value,
            project: descrypedProject
          })
        }
        this.setState({
          ready: true,
          projectId: null
        })
      }}
    />, {
      onOk: () => {
        this.modalRef && this.modalRef.handleSubmit()
      },
      onCancel: () => {
        Modal.hide()
        this.setState({
          projectId: null
        })
      }
    })
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
    const { projects } = this.props
    const { ready, projectId, project, code } = this.state
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
              showLineNumbers: true,
              tabSize: 2
            }}
            style={{
              width: '100%',
              height: 460
            }}
          />
        </div>
        <div style={{ height: 40, marginTop: 5, display: 'flex', flexDirection: 'row' }}>
          <Select
            value={projectId}
            placeholder='Please select a runtime'
            style={{
              flex: 1,
              marginRight: 5
            }}
            onChange={this.onChangeRuntime}
          >
            {projects.map(item => {
              return (
                <Select.Option key={`${item.key}`} value={item.key}>{item.name}</Select.Option>
              )
            })}
          </Select>
          <Button
            style={{ marginLeft: 5, flex: 1 }}
            title='Compile'
            color='primary'
            disabled={!ready}
            onClick={this.onCompile}
          >
            Compile
          </Button>
        </div>
      </div>
    )
  }
}

export default CodeEditor
