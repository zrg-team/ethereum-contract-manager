import React, { Component } from 'react'
import {
  Form,
  Input,
  Checkbox,
  Button,
  Row,
  Icon,
  Switch,
  Tooltip,
  message,
  notification
} from 'antd'
import '../styles/edit.css'
import Modal from '../../../common/components/widgets/Modal'
import ConfirmPassword from '../../dashboard/components/ConfirmPassword'
import RequestConfig from '../../project/components/RequestConfig'
import I18n from 'i18n-js'
const FormItem = Form.Item

class EditGeneral extends Component {
  constructor (props) {
    super(props)
    this.state = {
      connectFullnode: true,
      general: {},
      transactionRequest: {},
      nonceRequest: {},
      ethCallRequest: {},
      receiptRequest: {}
    }
    this.onChangeMode = this.onChangeMode.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.openSetting = this.openSetting.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  onChangeMode () {
    const { connectFullnode } = this.state
    this.setState({
      connectFullnode: !connectFullnode
    })
  }
  openSetting (mode) {
    Modal.show(<RequestConfig
      wrappedComponentRef={(ref) => {
        this.modalRef = ref
      }}
      mode={mode}
      onSubmit={(values) => {
        Modal.hide()
        switch (mode) {
          case 'broadcast':
            return this.setState({
              transactionRequest: values
            })
          case 'nonce':
            return this.setState({
              nonceRequest: values
            })
          case 'ethCall':
            return this.setState({
              ethCallRequest: values
            })
          case 'receipt':
            return this.setState({
              receiptRequest: values
            })
          default:
            return false
        }
      }}
    />, {
      onOk: () => {
        this.modalRef && this.modalRef.handleSubmit()
      },
      onCancel: () => Modal.hide()
    })
  }

  componentDidMount () {
    const { currentProject: { general } } = this.props
    const { transactionRequest, nonceRequest, ethCallRequest, receiptRequest, fullnode } = general
    console.log('fullnode', fullnode, !fullnode)
    this.setState({
      connectFullnode: fullnode || false,
      transactionRequest,
      nonceRequest,
      ethCallRequest,
      receiptRequest
    })
  }
  handleSubmit (e) {
    e.preventDefault()
    const { transactionRequest, nonceRequest, ethCallRequest, receiptRequest } = this.state
    this.props.form.validateFieldsAndScroll((err, newValues) => {
      if (!err) {
        const newGeneral = {
          ...newValues,
          transactionRequest,
          nonceRequest,
          ethCallRequest,
          receiptRequest
        }
        const { match: { params }, history, saveEditGeneral } = this.props
        Modal.show(<ConfirmPassword
          ref={(ref) => {
            this.modalRef = ref
          }}
          onSubmit={async (password) => {
            const loading = message.loading('Process loading', 0)
            const result = await saveEditGeneral(params.id, newGeneral, password)
            Modal.hide()
            loading()
            if (result) {
              notification.success({
                message: 'Notification',
                description: 'Edit your project.'
              })
              return history.replace('/dashboard')
            } else {
              message.error(I18n.t('errors.wrong_password'))
            }
          }}
        />, {
          onOk: () => {
            this.modalRef && this.modalRef.handleSubmit()
          },
          onCancel: () => Modal.hide()
        })
      }
    })
  }

  handleBack () {
    const { history } = this.props
    history.replace('/dashboard')
  }

  render () {
    console.log('render', this.state)
    const { connectFullnode } = this.state
    const { form: { getFieldDecorator, getFieldValue }, currentProject: { general } } = this.props
    const { name, fullnode, transactionUrl, callTransactionUrl, checkTransactionUrl, nonceTransactionUrl, insightUrl } = general
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    }
    return (
      <Row justify='center' className='edit-row'>
        <Form layout='horizontal' onSubmit={this.handleSubmit}>
          <div className='general-container'>
            <FormItem
              {...formItemLayout}
              label='Project Name'
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: 'Please input your Project Name!'
                }],
                initialValue: name
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='Project Description'
            >
              {getFieldDecorator('description', {
                rules: [{
                  required: false
                }],
                initialValue: this.props.currentProject.description
              })(
                <Input.TextArea rows={4} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='Connect to Fullnode'
            >
              <Switch checked={connectFullnode} defaultChecked onChange={this.onChangeMode} />
            </FormItem>
            {connectFullnode
              ? <React.Fragment>
                <FormItem
                  {...formItemLayout}
                  label='Fullnode'
                >
                  {getFieldDecorator('fullnode', {
                    rules: [{
                      required: true, message: 'Please input your fullnode url!'
                    }],
                    initialValue: fullnode
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='Submit transaction url'
                >
                  {getFieldDecorator('transactionUrl', {
                    rules: [],
                    initialValue: transactionUrl
                  })(
                    <Input
                      placeholder='Example: https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=0xf90...'
                      addonAfter={
                        <Tooltip title='Setting your request. Required field for raw transaction example "hex"'>
                          <Icon type='setting' theme='outlined' onClick={() => this.openSetting('broadcast')} />
                        </Tooltip>}
                    />
                  )}
                </FormItem>
              </React.Fragment>
              : <React.Fragment>
                <FormItem
                  {...formItemLayout}
                  label='Submit transaction url'
                >
                  {getFieldDecorator('transactionUrl', {
                    rules: [{
                      required: true,
                      message: 'Please input your url to broadcast transaction!'
                    }],
                    initialValue: transactionUrl
                  })(
                    <Input
                      placeholder='Example: https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=0xf90...'
                      addonAfter={
                        <Tooltip title='Setting your request. Required field for raw transaction example "hex"'>
                          <Icon type='setting' theme='outlined' onClick={() => this.openSetting('broadcast')} />
                        </Tooltip>
                      }
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='Call transaction url'
                >
                  {getFieldDecorator('callTransactionUrl', {
                    rules: [{
                      required: true,
                      message: 'Please input your Url to call contract!'
                    }],
                    initialValue: callTransactionUrl
                  })(
                    <Input
                      placeholder='Example: https://api.etherscan.io/api?module=proxy&action=eth_call&to=0xAEEF...&data=0x70a0...'
                      addonAfter={
                        <Tooltip title='Setting your request. Required field for data and to address'>
                          <Icon type='setting' theme='outlined' onClick={() => this.openSetting('ethCall')} />
                        </Tooltip>}
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='Get nonce transaction url'
                >
                  {getFieldDecorator('nonceTransactionUrl', {
                    rules: [{
                      required: true,
                      message: 'Please input your url to get nonce!'
                    }],
                    initialValue: nonceTransactionUrl
                  })(
                    <Input
                      placeholder='Example: https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=0x291054...'
                      addonAfter={
                        <Tooltip title='Setting your request. Required address field'>
                          <Icon type='setting' theme='outlined' onClick={() => this.openSetting('nonce')} />
                        </Tooltip>}
                    />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label='check transaction url'
                >
                  {getFieldDecorator('checkTransactionUrl', {
                    rules: [],
                    initialValue: checkTransactionUrl
                  })(
                    <Input
                      placeholder='Example: https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=0x1e2910a26...'
                      addonAfter={
                        <Tooltip title='Setting your request. Required transaction hash field'>
                          <Icon type='setting' theme='outlined' onClick={() => this.openSetting('receipt')} />
                        </Tooltip>}
                    />
                  )}
                </FormItem>
              </React.Fragment>
            }
            <FormItem
              {...formItemLayout}
              label='View transaction url'
            >
              {getFieldDecorator('insightUrl', {
                rules: [],
                initialValue: insightUrl
              })(
                <Input placeholder='Example: https://etherscan.io/tx/0x7...' />
              )}
            </FormItem>
          </div>
          <FormItem {...tailFormItemLayout}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked'
            })(
              <Checkbox>I have read the <a href='#'>agreement</a></Checkbox>
            )}
          </FormItem>
          <Form.Item>
            <Button
              style={{ marginRight: 5 }}
              onClick={this.handleBack}
              size='large'
              htmlType='button'
            >
              <Icon type='left' /> Back
            </Button>
            <Button
              type='primary'
              size='large'
              htmlType='submit'
              disabled={!getFieldValue('agreement')}
              onClick={this.handleSubmit}
            >
              Save <Icon type='save' />
            </Button>
          </Form.Item>
        </Form>
      </Row>
    )
  }
}

export default Form.create()(EditGeneral)
