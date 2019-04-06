import React from 'react'
import I18n from 'i18n-js'
import 'brace'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import AceEditor from 'react-ace'
import {
  Icon,
  Menu,
  Button,
  Select,
  message,
  Dropdown
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
    this.fileInput = null
    this.saveFile = this.saveFile.bind(this)
    this.onCompile = this.onCompile.bind(this)
    this.selectFile = this.selectFile.bind(this)
    this.selectMenu = this.selectMenu.bind(this)
    this.onChangeCode = this.onChangeCode.bind(this)
    this.onChangeRuntime = this.onChangeRuntime.bind(this)

    this.menu = (
      <Menu onClick={this.selectMenu} style={{ width: 120 }}>
        <Menu.Item key='open'>
          <Icon type='folder-open' /> Open
        </Menu.Item>
        <Menu.Item key='save'>
          <input
            ref={(ref) => {
              this.fileInput = ref
            }}
            type='file'
            onChange={this.selectFile}
            accept='application/javascript'
            style={{ width: 0, height: 0, overflow: 'hidden' }}
          />
          <Icon type='save' style={{ marginRight: 10 }} /> Save
        </Menu.Item>
      </Menu>
    )
  }
  selectFile (e) {
    try {
      const files = e.target.files
      const reader = new FileReader()
      reader.onload = (upload) => {
        try {
          this.setState({
            code: upload.target.result
          })
        } catch (err) {
          message.error(I18n.t('errors.read_contract_file_error'))
        }
      }

      reader.readAsText(files[0], 'TF-8')
    } catch (err) {
    }
  }
  saveFile () {
    const { code } = this.state
    const { saveSourceFile } = this.props
    saveSourceFile(code)
  }
  selectMenu (menu) {
    switch (menu.key) {
      case 'open':
        return this.fileInput && this.fileInput.click()
      case 'save':
        return this.saveFile()
      default:
        break
    }
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
        console.log('descrypedProject', descrypedProject)
        Modal.hide()
        if (descrypedProject) {
          this.factory = await createFactory(descrypedProject)
          this.compiler = createSanboxCompiler(this.factory)
          return this.setState({
            ready: true,
            projectId: value
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
    const { ready, projectId, code } = this.state
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
        <div style={{ height: 40, marginTop: 10, display: 'flex', flexDirection: 'row' }}>
          <Dropdown overlay={this.menu} placement='bottomCenter'>
            <Button type='primary' shape='circle-outline'>
              <Icon type='file' width='3em' height='3em' style={{ paddingBottom: 10 }} />
            </Button>
          </Dropdown>
          <Select
            value={projectId}
            placeholder='Please select a runtime'
            style={{
              flex: 1,
              marginLeft: 5,
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
            type='primary'
            disabled={!ready}
            onClick={this.onCompile}
          >
            Run
          </Button>
        </div>
      </div>
    )
  }
}

export default CodeEditor
