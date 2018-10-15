import React from 'react'
import {
  Icon,
  Form,
  Input,
  Upload,
  message
} from 'antd'
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
    const loading = message.loading('Action in progress..', 0)
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
          message.error('Add contract error!')
        }
      }
    })
  }
  uploadFile (e) {
    const file = e.file
    const reader = new FileReader()
    reader.onload = (upload) => {
      this.setState({
        abi: upload.target.result,
        fileName: file.name
      })
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
          label='Contract Name'
        >
          {getFieldDecorator('contractName', {
            rules: [{
              required: true,
              message: 'Please input your Contract Name!'
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='Contract Address'
        >
          {getFieldDecorator('contractAddress', {
            rules: [{
              required: true,
              message: 'Please input your Contract Address!'
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
                <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                <p className='ant-upload-hint'>Support for a single</p>
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
