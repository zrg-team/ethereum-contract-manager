import React, { Component, Fragment } from 'react'
import {
  Form,
  Input,
  Checkbox,
  Button,
  Row,
  List,
  Card,
  Icon,
  Steps,
  Switch,
  message,
  Tooltip,
  notification,
  Modal as ModalCofirm
} from 'antd'
import I18n from 'i18n-js'
import Modal from '../../../common/components/widgets/Modal'
import NewAccount from './NewAccount'
import NewContract from './NewContract'
import RequestConfig from './RequestConfig'
import '../styles/newForm.css'

const FormItem = Form.Item
class NewForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 0,
      confirmDirty: false,
      accounts: [],
      contracts: [],
      connectFullnode: true,
      transactionRequest: {},
      nonceRequest: {},
      ethCallRequest: {},
      receiptRequest: {}
    }
    this.steps = [
      { key: 0, title: 'General', description: 'Project name, server, etc' },
      { key: 1, title: 'Account', description: 'List account using in system' },
      { key: 2, title: 'Contract', description: 'Ethereum contract using in system' },
      { key: 4, title: 'Finished', description: 'Save and export project' }
    ]
    this.nextStep = this.nextStep.bind(this)
    this.backStep = this.backStep.bind(this)
    this.renderStep = this.renderStep.bind(this)
    this.addAccount = this.addAccount.bind(this)
    this.openSetting = this.openSetting.bind(this)
    this.addContract = this.addContract.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChangeMode = this.onChangeMode.bind(this)
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
    this.renderAccountItem = this.renderAccountItem.bind(this)
    this.renderContractItem = this.renderContractItem.bind(this)
    this.validateToNextPassword = this.validateToNextPassword.bind(this)
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this)
  }

  nextStep (e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, newValues) => {
      if (!err) {
        const { step, values } = this.state
        this.setState({
          step: +step + 1,
          values: {
            ...values,
            ...newValues
          }
        })
      }
    })
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

  addAccount () {
    Modal.show(<NewAccount
      wrappedComponentRef={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={(values) => {
        const { accounts } = this.state
        if (!accounts.some(item => item.address === values.address)) {
          accounts.push(values)
          this.setState({
            accounts
          }, () => Modal.hide())
        } else {
          message.error('Exist account !')
        }
      }}
    />, {
      onOk: () => {
        this.modalRef && this.modalRef.handleSubmit()
      },
      onCancel: () => Modal.hide()
    })
  }

  addContract () {
    Modal.show(<NewContract
      wrappedComponentRef={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={(values) => {
        const { contracts } = this.state
        if (!contracts.some(item => item.address === values.address)) {
          contracts.push(values)
          this.setState({
            contracts
          }, () => Modal.hide())
        } else {
          message.error('Exist contract !')
        }
      }}
    />, {
      onOk: () => {
        this.modalRef && this.modalRef.handleSubmit()
      },
      onCancel: () => Modal.hide()
    })
  }

  backStep (e) {
    const { setFieldsValue } = this.props.form
    e.preventDefault()
    const { step, values } = this.state
    this.setState({
      step: +step - 1
    }, () => {
      setFieldsValue({
        ...values
      })
    })
  }

  handleSubmit () {
    const { history, saveData, form: { getFieldValue } } = this.props
    const {
      values,
      accounts,
      contracts,
      receiptRequest,
      transactionRequest,
      nonceRequest,
      ethCallRequest
    } = this.state
    const password = getFieldValue('password')
    ModalCofirm.confirm({
      title: 'Do you want to save this project ?',
      content: `Project ${values.name} have ${accounts.length} accounts and ${contracts.length} contracts .`,
      onOk () {
        const data = {
          general: {
            ...values,
            transactionRequest,
            nonceRequest,
            ethCallRequest,
            receiptRequest
          },
          accounts,
          contracts
        }
        const loading = message.loading('Process loading', 0)
        setTimeout(async () => {
          const result = await saveData(data, password)
          loading()
          if (result) {
            notification.success({
              message: 'Notification',
              description: 'Created your project.'
            })
            return history.replace('/dashboard')
          }
        }, 100)
      },
      onCancel () {
      }
    })
  }
  handleConfirmBlur (e) {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  compareToFirstPassword (rule, value, callback) {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      return callback('Two passwords that you enter is inconsistent!')
    }
    callback()
  }

  validateToNextPassword (rule, value, callback) {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  renderAccountItem (item) {
    return (<List.Item>
      <Card
        actions={[
          <Icon type='setting' />,
          <Icon type='edit' />,
          <Icon type='ellipsis' />
        ]}
      >
        <Card.Meta
          title={item.name}
          style={{
            marginBottom: 10
          }}
        />
        <p className='break-text'>Address: {item.address}</p>
        <p className='break-text'>Publickey: {`${item.publicKey}`.substr(0, 10)}...</p>
        <p className='break-text'>Privatekey: {`${item.privateKey}`.substr(0, 5)}...</p>
      </Card>
    </List.Item>)
  }

  renderContractItem (item) {
    return (<List.Item>
      <Card
        actions={[
          <Icon type='setting' />,
          <Icon type='edit' />,
          <Icon type='ellipsis' />
        ]}
      >
        <Card.Meta
          title={item.name}
          style={{
            marginBottom: 10
          }}
        />
        <p className='break-text'>Address: {item.address}</p>
        <p className='break-text'>ABI: {`${item.abi}`.substr(0, 10)}...</p>
      </Card>
    </List.Item>)
  }

  renderStep (step) {
    const { contracts, accounts, connectFullnode } = this.state
    const { getFieldDecorator, getFieldValue } = this.props.form
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
    switch (step) {
      case 0:
        return (
          <Fragment>
            <div className='general-container'>
              <FormItem
                {...formItemLayout}
                label='Project Name'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true, message: 'Please input your Project Name!'
                  }]
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
                  }]
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
                ? <Fragment>
                  <FormItem
                    {...formItemLayout}
                    label='Fullnode'
                  >
                    {getFieldDecorator('fullnode', {
                      rules: [{
                        required: true, message: 'Please input your fullnode url!'
                      }]
                    })(
                      <Input />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label='Submit transaction url'
                  >
                    {getFieldDecorator('transactionUrl', {
                      rules: []
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
                </Fragment>
                : <Fragment>
                  <FormItem
                    {...formItemLayout}
                    label='Submit transaction url'
                  >
                    {getFieldDecorator('transactionUrl', {
                      rules: [{
                        required: true,
                        message: 'Please input your url to broadcast transaction!'
                      }]
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
                      }]
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
                      }]
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
                      rules: []
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
                </Fragment>
              }
              <FormItem
                {...formItemLayout}
                label='View transaction url'
              >
                {getFieldDecorator('insightUrl', {
                  rules: []
                })(
                  <Input placeholder='Example: https://etherscan.io/tx/0x7...' />
                )}
              </FormItem>
            </div>
            <FormItem {...tailFormItemLayout}>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked'
              })(
                <Checkbox>I have read the <a href=''>agreement</a></Checkbox>
              )}
            </FormItem>
            <Row className='center-container' justify='center' align='center'>
              <Button
                disabled={!getFieldValue('agreement')}
                onClick={this.nextStep}
                htmlType='button'
              >
                Next <Icon type='right' />
              </Button>
            </Row>
          </Fragment>
        )
      case 1:
        return (
          <Fragment>
            <List
              className='list-container'
              grid={{ gutter: 10, column: 4 }}
              dataSource={accounts}
              renderItem={this.renderAccountItem}
            />
            <Row className='center-container' justify='center' align='center'>
              <Button
                onClick={this.backStep}
                size='large'
                htmlType='button'
              >
                <Icon type='left' /> Back
              </Button>
              <Button
                size='large'
                type='dashed'
                onClick={this.addAccount}
                style={{ width: '50%', marginLeft: 5, marginRight: 5 }}
              >
                <Icon type='plus' /> New Account
              </Button>
              <Button
                onClick={this.nextStep}
                size='large'
                htmlType='button'
              >
                Next <Icon type='right' />
              </Button>
            </Row>
          </Fragment>
        )
      case 2:
        return (
          <Fragment>
            <List
              className='list-container'
              grid={{ gutter: 10, column: 4 }}
              dataSource={contracts}
              renderItem={this.renderContractItem}
            />
            <Row className='center-container' justify='center' align='center'>
              <Button
                onClick={this.backStep}
                size='large'
                htmlType='button'
              >
                <Icon type='left' /> Back
              </Button>
              <Button
                size='large'
                type='dashed'
                onClick={this.addContract}
                style={{ width: '50%', marginLeft: 5, marginRight: 5 }}
              >
                <Icon type='plus' /> New Contract
              </Button>
              <Button
                onClick={this.nextStep}
                size='large'
                htmlType='button'
              >
                Next <Icon type='right' />
              </Button>
            </Row>
          </Fragment>
        )
      case 3:
        return (
          <Fragment>
            <FormItem
              {...formItemLayout}
              label='Password'
            >
              {getFieldDecorator('password', {
                rules: [{
                  validator: this.validateToNextPassword
                }]
              })(
                <Input type='password' />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='Confirm Password'
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  validator: this.compareToFirstPassword
                }]
              })(
                <Input type='password' onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <Row className='center-container' justify='center' align='center'>
              <Button
                onClick={this.backStep}
                size='large'
                htmlType='button'
                style={{ marginRight: 5 }}
              >
                <Icon type='left' /> Back
              </Button>
              <Button
                onClick={this.handleSubmit}
                type='primary'
                size='large'
                htmlType='button'
                style={{ marginLeft: 5 }}
              >
                Save <Icon type='save' />
              </Button>
            </Row>
          </Fragment>
        )
      default:
        return null
    }
  }

  render () {
    const { step } = this.state
    return (
      <Form layout='horizontal' onSubmit={this.handleSubmit}>
        <Row className='new-form-step' justify='center'>
          <Steps current={step}>
            {this.steps.map(item => {
              return <Steps.Step key={item.key} title={item.title} description={item.description} />
            })}
          </Steps>
        </Row>
        <Row justify='center'>
          {this.renderStep(step)}
        </Row>
      </Form>
    )
  }
}

export default Form.create()(NewForm)
