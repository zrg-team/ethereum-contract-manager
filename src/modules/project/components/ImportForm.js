import React, { Fragment } from 'react'
import {
  Icon,
  Row,
  Input,
  Upload,
  Button,
  message
} from 'antd'

class ImportForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: '',
      password: '',
      fileName: ''
    }
    this.process = false
    this.uploadFile = this.uploadFile.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
  }
  onChangePassword (e) {
    this.setState({ password: e.target.value })
  }
  handleSubmit () {
    const { importProject } = this.props
    const { data, password } = this.state
    if (!data) {
      return message.error('File data required!')
    }
    const loading = message.loading('Action in progress...', 0)
    setTimeout(async () => {
      await importProject(data, password)
      loading()
    }, 200)
  }
  uploadFile (info) {
    const { data } = this.state
    if (this.process || data) {
      return false
    }
    this.process = true
    const file = info.file
    const reader = new FileReader()
    reader.onload = (upload) => {
      this.setState({
        data: upload.target.result,
        fileName: file.name
      }, () => {
        this.process = false
      })
    }
    reader.readAsText(file.originFileObj, 'TF-8')
    message.success(`${info.file.name} file uploaded successfully.`)
  }
  render () {
    const { data, fileName } = this.state
    return (
      <Fragment>
        <Row
          style={{ marginBottom: 15 }}
          className='center-container'
          justify='center'
          align='center'
        >
          {!data ? <Upload.Dragger
            multiple={false}
            name='files'
            onChange={this.uploadFile}
          >
            <p className='ant-upload-drag-icon'>
              <Icon type='inbox' />
            </p>
            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
            <p className='ant-upload-hint'>Support for a single</p>
          </Upload.Dragger> : <p><Icon type='file' /> <span>{fileName}</span></p>}
        </Row>
        <Row
          style={{ marginBottom: 15 }}
          className='center-container'
          justify='center'
          align='center'
        >
          <Input
            type={'password'}
            onChange={this.onChangePassword}
            style={{ width: 500 }}
            prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </Row>
        <Row
          style={{ marginBottom: 15 }}
          className='center-container'
          justify='center'
          align='center'
        >
          <Button
            onClick={this.handleSubmit}
            type='primary'
            size='large'
            htmlType='button'
          >
            Save <Icon type='save' />
          </Button>
        </Row>
      </Fragment>
    )
  }
}

export default ImportForm
