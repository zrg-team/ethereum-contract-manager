import React from 'react'
import {
  Row,
  Col,
  Select,
  Form,
  Input,
  Card,
  Icon,
  Button,
  InputNumber,
  Collapse,
  notification,
  message
} from 'antd'
import I18n from 'i18n-js'
import Modal from '../../../common/components/widgets/Modal'
import GenerateData from './GenerateData'

class Send extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      from: '',
      balances: {},
      valueSend: '',
      address: '',
      data: '',
      gasLimit: '21000',
      gasPrice: '2000000000'
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.selectAccount = this.selectAccount.bind(this)
    this.onChangeAddress = this.onChangeAddress.bind(this)
    this.onChangeGasPrice = this.onChangeGasPrice.bind(this)
    this.onChangeGasLimit = this.onChangeGasLimit.bind(this)
    this.onChangeValueSend = this.onChangeValueSend.bind(this)
    this.generateTransactionData = this.generateTransactionData.bind(this)
    this.onChangeTransactionData = this.onChangeTransactionData.bind(this)
  }
  async onSubmit () {
    const {
      from,
      data,
      address,
      valueSend,
      gasLimit,
      gasPrice
    } = this.state
    const { send, currentProject, submitTimelife, accounts } = this.props
    const params = {
      from,
      data,
      to: address,
      value: valueSend,
      gasLimit,
      gasPrice
    }
    const account = accounts.find(item => item.address === address)
    const result = await send(currentProject, params)
    if (result) {
      submitTimelife(result, currentProject, {
        params,
        account: {
          name: account.name,
          address: account.address
        },
        contractFunction: {

        },
        contract: {
          name: '',
          address: address
        },
        raw: result.raw
      })
      Modal.hide()
      if (result) {
        return notification.success({
          message: I18n.t('messages.transaction_success'),
          description: result
        })
      }
      message.error(I18n.t('errors.transaction_error'))
    }
  }
  selectAccount (value) {
    this.setState({
      from: value
    })
  }
  onChangeGasLimit (gasLimit) {
    this.setState({
      gasLimit
    })
  }
  onChangeGasPrice (gasPrice) {
    this.setState({
      gasPrice
    })
  }
  onChangeTransactionData (e) {
    this.setState({
      data: e.target.value
    })
  }
  onChangeAddress (e) {
    this.setState({
      address: e.target.value
    })
  }
  onChangeValueSend (valueSend) {
    this.setState({
      valueSend
    })
  }
  generateTransactionData () {
    Modal.show(<GenerateData
      wrappedComponentRef={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={(values) => {
        const { convertTransactionData } = this.props
        const data = convertTransactionData(values)
        this.setState({
          data
        }, () => {
          Modal.hide()
        })
      }}
    />, {
      onOk: () => {
        this.modalRef && this.modalRef.handleSubmit()
      },
      onCancel: () => Modal.hide()
    })
  }
  render () {
    const { from, address, valueSend, data, gasPrice, gasLimit } = this.state
    const { accounts } = this.props
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
      }}>
        <Card
          style={{ width: 500, display: 'flex', flexDirection: 'column' }}
          actions={[<Button type='primary' size='large' onClick={this.onSubmit}><Icon type='check-circle' />Send</Button>]}
          bodyStyle={{ flex: 1, overflowY: 'auto' }}
        >
          <Card.Meta
            title={I18n.t('playground.send_transaction')}
          />
          <Form.Item
            label={I18n.t('playground.accounts')}
          >
            <Select
              value={from}
              style={{ width: '100%' }}
              placeholder={I18n.t('playground.select_account')}
              onChange={this.selectAccount}
            >
              {accounts && accounts.map(item => {
                return (
                  <Select.Option value={item.address} key={item.address}>{item.name}</Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
          >
            <InputNumber
              value={valueSend}
              placeholder={I18n.t('common.value_send')}
              style={{ width: 'calc(100%)' }}
              onChange={this.onChangeValueSend}
            />
          </Form.Item>
          <Form.Item
          >
            <Input
              value={address}
              placeholder={I18n.t('common.to_address')}
              onChange={this.onChangeAddress}
            />
          </Form.Item>
          <Collapse accordion>
            <Collapse.Panel header={I18n.t('common.transaction_fee')} key='1'>
              <Row style={{ width: '100%' }}>
                <Col span={12}>
                  <Form.Item
                    label={I18n.t('common.gas_price')}
                  >
                    <InputNumber
                      value={gasPrice}
                      style={{ width: 'calc(100% - 30px)' }}
                      placeholder='Value'
                      onChange={this.onChangeGasPrice}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={I18n.t('common.gas_limit')}
                  >
                    <InputNumber
                      value={gasLimit}
                      style={{ width: 'calc(100% - 30px)' }}
                      placeholder='Value'
                      onChange={this.onChangeGasLimit}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Collapse.Panel>
            <Collapse.Panel header={I18n.t('common.transaction_data')} key='3'>
              <Form.Item
              >
                <Input.TextArea
                  value={data}
                  placeholder={I18n.t('common.hex_data')}
                  onChange={this.onChangeTransactionData}
                />
              </Form.Item>
              <Form.Item>
                <Button type='dashed' onClick={this.generateTransactionData} style={{ width: '100%' }}>
                  <Icon type='plus' /> {I18n.t('common.generate_transaction_data')}
                </Button>
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Card>
      </div>
    )
  }
}

export default Send
