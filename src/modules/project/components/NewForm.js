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
  message,
  notification,
  Modal as ModalConirm
} from 'antd'
import Modal from '../../../common/components/widgets/Modal'
import NewAccount from './NewAccount'
import NewContract from './NewContract'
import '../styles/newForm.css'

const FormItem = Form.Item
class NewForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 0,
      confirmDirty: false,
      accounts: [],
      contracts: []
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
    this.addContract = this.addContract.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

  addAccount () {
    Modal.show(<NewAccount
      wrappedComponentRef={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={(values) => {
        const { accounts } = this.state
        accounts.push(values)
        this.setState({
          accounts
        }, () => Modal.hide())
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
        contracts.push(values)
        this.setState({
          contracts
        }, () => Modal.hide())
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
    const { values, accounts, contracts } = this.state
    const password = getFieldValue('password')
    ModalConirm.confirm({
      title: 'Do you want to save this project ?',
      content: `Project ${values.name} have ${accounts.length} accounts and ${contracts.length} contracts .`,
      onOk () {
        const data = {
          general: values,
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
    const { contracts, accounts } = this.state
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
                label='Fullnode url'
              >
                {getFieldDecorator('fullnode', {
                  rules: [{
                    required: true, message: 'Please input your FullNode url!'
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
                  rules: [{
                    required: false
                  }]
                })(
                  <Input />
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
      <Form onSubmit={this.handleSubmit}>
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
