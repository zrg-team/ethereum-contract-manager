import React from 'react'
import {
  Form,
  Input,
  message
} from 'antd'
import I18n from 'i18n-js'
import ethereumAccount from '../../../common/utils/ethereumAccount'
const FormItem = Form.Item

class NewAccount extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit () {
    const loading = message.loading(I18n.t('common.loading_action'), 0)
    setTimeout(() => {
      const { v3String, form, onSubmit } = this.props
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
              key: `${values.accountName}`.replace(/\s/g, '_'),
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
            message.error(I18n.t('errors.import_error'))
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
          label={I18n.t('project.account_name')}
        >
          {getFieldDecorator('accountName', {
            rules: [{
              required: true,
              message: I18n.t('errors.required_field')
            }]
          })(
            <Input />
          )}
        </FormItem>}
        <FormItem
          {...formItemLayout}
          label={I18n.t('common.account_value')}
        >
          {getFieldDecorator('accountPrivate', {
            rules: [{
              required: true,
              message: I18n.t('errors.required_field')
            }]
          })(
            <Input.TextArea rows={4} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={I18n.t('common.account_password')}
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
