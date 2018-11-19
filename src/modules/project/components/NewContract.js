import React from 'react'
import {
  Icon,
  Form,
  Input,
  Upload,
  message
} from 'antd'
import I18n from 'i18n-js'
const FormItem = Form.Item

class NewContract extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      abi: '',
      fileName: ''
    }
    this.uploadFile = this.uploadFile.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit () {
    const { form, onSubmit } = this.props
    const loading = message.loading(I18n.t('common.loading_action'), 0)
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        try {
          const { abi } = this.state
          onSubmit && onSubmit({
            name: values.contractName,
            address: values.contractAddress,
            abi: abi
          })
          loading()
        } catch (err) {
          loading()
          message.error(I18n.t('errors.add_contract_error'))
        }
      } else {
        loading()
      }
    })
  }
  uploadFile (e) {
    const file = e.file
    const reader = new FileReader()
    reader.onload = (upload) => {
      try {
        const json = JSON.parse(upload.target.result)
        this.setState({
          abi: JSON.stringify(json.abi) || upload.target.result,
          fileName: file.name
        })
      } catch (err) {
        message.error(I18n.t('errors.read_contract_file_error'))
      }
    }

    reader.readAsText(file.originFileObj, 'TF-8')
  }
  render () {
    const { abi, fileName } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label={I18n.t('project.contract_name')}
        >
          {getFieldDecorator('contractName', {
            rules: [{
              required: true,
              message: I18n.t('errors.required_field')
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={I18n.t('project.contract_address')}
        >
          {getFieldDecorator('contractAddress', {
            rules: [{
              required: true,
              message: I18n.t('errors.required_field')
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='ABI'
        >
          {!abi ? <div className='dropbox'>
            {getFieldDecorator('dragger', {
              valuePropName: 'fileList',
              getValueFromEvent: this.uploadFile
            })(
              <Upload.Dragger multiple={false} name='files'>
                <p className='ant-upload-drag-icon'>
                  <Icon type='inbox' />
                </p>
                <p className='ant-upload-text'>{I18n.t('project.file_upload_message')}</p>
                <p className='ant-upload-hint'>{I18n.t('project.file_upload_support')}</p>
              </Upload.Dragger>
            )} </div> : (
              <p><Icon type='file' /> <span>{fileName}</span></p>
            )
          }
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(NewContract)
