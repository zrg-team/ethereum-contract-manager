import React from 'react'
import I18n from 'i18n-js'
import {
  Row,
  Col,
  Form,
  Input,
  Card,
  Icon,
  Button,
  InputNumber,
  Collapse,
  message
} from 'antd'
import Modal from '../../../common/components/widgets/Modal'
import ethereumAccount from '../../../common/utils/ethereumAccount'
import GenerateData from '../../playground/components/GenerateData'
const ReactMarkdown = require('react-markdown/with-html')

class GenerateTransaction extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      from: '',
      balances: {},
      valueSend: '',
      address: '',
      data: '',
      nonce: '',
      gasLimit: '21000',
      gasPrice: '2000000000',
      userPrivate: '',
      userPrivatePassword: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChangeAddress = this.onChangeAddress.bind(this)
    this.onChangePrivate = this.onChangePrivate.bind(this)
    this.onChangeGasPrice = this.onChangeGasPrice.bind(this)
    this.onChangeGasLimit = this.onChangeGasLimit.bind(this)
    this.onChangeValueSend = this.onChangeValueSend.bind(this)
    this.onChangeValueNonce = this.onChangeValueNonce.bind(this)
    this.onChangePrivatePassword = this.onChangePrivatePassword.bind(this)
    this.generateTransactionData = this.generateTransactionData.bind(this)
    this.onChangeTransactionData = this.onChangeTransactionData.bind(this)
  }
  onChangePrivatePassword (e) {
    this.setState({
      userPrivatePassword: e.target.value
    })
  }
  onChangeValueNonce (nonce) {
    this.setState({
      nonce
    })
  }
  onChangePrivate (e) {
    this.setState({
      userPrivate: e.target.value
    })
  }
  onSubmit () {
    const {
      from,
      data,
      address,
      valueSend,
      gasLimit,
      gasPrice,
      userPrivate,
      userPrivatePassword
    } = this.state
    const loading = message.loading(I18n.t('tools.loading_gererate_transaction'))
    setTimeout(async () => {
      const { generateTransactionHex } = this.props
      let privateKey = userPrivate
      try {
        if (ethereumAccount.validateSeed(userPrivate)) {
          privateKey = ethereumAccount.restoreWalletFromSeed(userPrivate).getPrivateKeyString()
        } else {
          privateKey = ethereumAccount.fromKeystore(userPrivate, userPrivatePassword).getPrivateKeyString()
        }
      } catch (err) {
      }
      const params = {
        from,
        data,
        to: address,
        value: valueSend,
        gasLimit,
        gasPrice,
        privateKey
      }
      const result = await generateTransactionHex(params)
      loading()
      if (result) {
        Modal.hide()
        if (result) {
          return Modal.show(<Card style={{ width: 450 }}>
            <ReactMarkdown
              skipHtml={false}
              rawSourcePos={false}
              sourcePos={false}
              escapeHtml={false}
              source={`
## **${I18n.t('common.params').toUpperCase()}**

---

${JSON.stringify(params)}

## **${I18n.t('common.transaction_hex').toUpperCase()}**

---

${result}

`}
            />
          </Card>, {
            onOk: () => {
              Modal.hide()
            },
            onCancel: () => Modal.hide()
          })
        }
        message.error(I18n.t('errors.transaction_error'))
      }
    }, 200)
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
    const {
      nonce,
      userPrivate,
      address,
      valueSend,
      data,
      gasPrice,
      gasLimit,
      userPrivatePassword
    } = this.state

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
          actions={[<Button type='primary' size='large' onClick={this.onSubmit}><Icon type='check-circle' />Generate Transaction</Button>]}
          bodyStyle={{ flex: 1, overflowY: 'auto' }}
          >
          <Form.Item
            label={I18n.t('common.account')}
          >
            <Input.TextArea
              value={userPrivate}
              style={{ width: '100%' }}
              placeholder={I18n.t('common.account_value')}
              onChange={this.onChangePrivate}
            />
          </Form.Item>
          <Form.Item
            label={I18n.t('common.account_password')}
          >
            <Input
              value={userPrivatePassword}
              style={{ width: '100%' }}
              type='password'
              onChange={this.onChangePrivatePassword}
            />
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
            <InputNumber
              value={nonce}
              placeholder={I18n.t('common.nonce')}
              style={{ width: 'calc(100%)' }}
              onChange={this.onChangeValueNonce}
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

export default GenerateTransaction
