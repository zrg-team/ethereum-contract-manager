import React from 'react'
import {
  Form,
  Input,
  message
} from 'antd'
import ethereumAccount from '../../../common/utils/ethereumAccount'
const FormItem = Form.Item

class NewAccount extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit () {
    const loading = message.loading('Action in progress..', 0)
    setTimeout(() => {
      const { form, onSubmit } = this.props
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let wallet = null
          try {
            if (ethereumAccount.validateSeed(values.accountPrivate)) {
              wallet = ethereumAccount.restoreWalletFromSeed(values.accountPrivate)
            } else {
              wallet = ethereumAccount.fromKeystore(values.accountPrivate, values.accountPassword)
            }
            onSubmit && onSubmit({
              name: values.accountName,
              address: wallet.getAddressString(),
              privateKey: wallet.getPrivateKeyString(),
              publicKey: wallet.getPublicKeyString()
            })
            loading()
          } catch (err) {
            loading()
            message.error('Invalid passphare or Wrong password of Keystore!')
          }
        }
      })
    }, 100)
  }
  render () {
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
          label='Account Name'
        >
          {getFieldDecorator('accountName', {
            rules: [{
              required: true,
              message: 'Please input your Account Name!'
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='Passphare or Keystore'
        >
          {getFieldDecorator('accountPrivate', {
            rules: [{
              required: true,
              message: 'Please input your Passphare or Keystore!'
            }]
          })(
            <Input.TextArea rows={4} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='Password for Keystore'
        >
          {getFieldDecorator('accountPassword', {
            rules: [{
              required: false
            }]
          })(
            <Input type='password' />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(NewAccount)
