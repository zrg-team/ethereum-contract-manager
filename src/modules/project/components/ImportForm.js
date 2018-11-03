import React, { Fragment } from 'react'
import I18n from 'i18n-js'
import {
  Icon,
  Row,
  // Input,
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
    const { history, importProject } = this.props
    const { data, password } = this.state
    if (!data) {
      return message.error(I18n.t('errors.file_data_required'))
    }
    const loading = message.loading(I18n.t('common.loading_action'), 0)
    setTimeout(async () => {
      await importProject(data, password)
      loading()
      history.replace('/dashboard')
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
    message.success(I18n.t('messages.upload_success', { file: info.file.name }))
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
            style={{ paddingLeft: 10, paddingRight: 10 }}
            onChange={this.uploadFile}
          >
            <p className='ant-upload-drag-icon'>
              <Icon type='inbox' />
            </p>
            <p className='ant-upload-text'>{I18n.t('project.file_upload_message')}</p>
            <p className='ant-upload-hint'>{I18n.t('project.file_upload_support')}</p>
          </Upload.Dragger> : <p><Icon type='file' /> <span>{fileName}</span></p>}
        </Row>
        {/* <Row
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
        </Row> */}
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
            {I18n.t('common.save')} <Icon type='save' />
          </Button>
        </Row>
      </Fragment>
    )
  }
}

export default ImportForm
