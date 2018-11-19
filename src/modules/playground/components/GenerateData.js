import React from 'react'
import {
  Row,
  Col,
  Icon,
  Form,
  Input,
  Button,
  Select,
  message
} from 'antd'
import I18n from 'i18n-js'
import { parseTransactionParams } from '../../../common/utils/ethereum'
const FormItem = Form.Item

const TYPES = {
  address: 'address',
  bytes32: 'bytes32',
  uint: 'uint',
  uint8: 'uint8',
  uint16: 'uint16',
  uint32: 'uint32',
  uint64: 'uint64',
  uint128: 'uint128',
  uint256: 'uint256',
  bool: 'bool',
  arrayUint: 'uint array',
  arrayUint8: 'uint 8 array',
  arrayUint16: 'uint 16 array',
  arrayUint32: 'uint 32 array',
  arrayUint64: 'uint 64 array',
  arrayUint128: 'uint 128 array',
  arrayUint256: 'uint 256 array',
  arrayBytes32: 'bytes32 array',
  arrayAddress: 'address array'
}
class GenerateData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      params: []
    }
    this.addParam = this.addParam.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChangeType = this.onChangeType.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
  }
  onChangeType (value, item) {
    let { params } = this.state
    params = params.map(param => {
      if (param.id === item.id) {
        param.type = value
      }
      return param
    })
    this.setState({
      params
    })
  }
  onChangeValue (e, item) {
    let { params } = this.state
    params = params.map(param => {
      if (param.id === item.id) {
        param.value = e.target.value
      }
      return param
    })
    this.setState({
      params
    })
  }
  addParam () {
    const { params } = this.state
    const id = new Date().getTime()
    params.push({ id, type: '', value: '' })
    this.setState({
      params
    })
  }
  handleSubmit () {
    const loading = message.loading(I18n.t('common.loading_action'), 0)
    setTimeout(() => {
      const { params } = this.state
      const { form, onSubmit } = this.props
      loading()
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const paramTypes = []
          const paramValues = []
          params.forEach(item => {
            const parsed = parseTransactionParams(item)
            paramTypes.push(parsed.type)
            paramValues.push(parsed.value)
          })
          onSubmit && onSubmit({
            ...values,
            typeParams: paramTypes,
            params: paramValues
          })
        }
      })
    }, 100)
  }
  render () {
    const { params } = this.state
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
          label={I18n.t('playground.function_name')}
        >
          {getFieldDecorator('functionName', {
            rules: [{
              required: true,
              message: I18n.t('errors.required_field')
            }]
          })(
            <Input />
          )}
        </FormItem>
        {params && params.map((item) => {
          return (<Row key={item.id} style={{ width: '100%' }}>
            <Col span={12}>
              <Form.Item
                label='Type'
              >
                <Select
                  style={{ width: 'calc(100% - 10px)', marginRight: '10px' }}
                  placeholder={I18n.t('playground.select_user')}
                  onChange={(e) => this.onChangeType(e, item)}
                >
                  {Object.keys(TYPES).map(key => {
                    return (
                      <Select.Option value={key} key={key}>{TYPES[key]}</Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={I18n.t('playground.value')}
              >
                <Input
                  style={{ width: 'calc(100% - 10px)', marginLeft: '10px' }}
                  placeholder={I18n.t('playground.value')}
                  onChange={(e) => this.onChangeValue(e, item)}
                />
              </Form.Item>
            </Col>
          </Row>)
        })}
        <Form.Item>
          <Button type='dashed' onClick={this.addParam} style={{ width: '100%' }}>
            <Icon type='plus' /> {I18n.t('playground.add_param')}
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(GenerateData)
