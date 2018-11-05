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
      const { v3String, form, onSubmit, account = true } = this.props
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let wallet = null
          try {
            ethereumAccount.fromPrivateKey(values.accountPrivate)
            wallet = values.accountPrivate
          } catch (err) {
            console.error('error', err)
          }
          try {
            if (!wallet && ethereumAccount.validateSeed(values.accountPrivate)) {
              wallet = ethereumAccount.restoreWalletFromSeed(values.accountPrivate)
            } else if (!wallet) {
              wallet = ethereumAccount.fromKeystore(values.accountPrivate, values.accountPassword)
            }
            onSubmit && onSubmit({
              name: values.accountName,
              address: wallet.getAddressString(),
              privateKey: wallet.getPrivateKeyString(),
              publicKey: wallet.getPublicKeyString(),
              v3String: v3String ? wallet.toV3String(values.accountPassword) : undefined
            })
            loading()
          } catch (err) {
            loading()
            console.error('err', err)
            message.error('Invalid passphare or Wrong password of Keystore!')
          }
        } else {
          loading()
        }
      })
    }, 100)
  }
  render () {
    const { account = true } = this.props
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
        {account && <FormItem
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
        </FormItem>}
        <FormItem
          {...formItemLayout}
          label='PrivateKey, Passphare or Keystore'
        >
          {getFieldDecorator('accountPrivate', {
            rules: [{
              required: true,
              message: 'Please input your PrivateKey, Passphare or Keystore!'
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
