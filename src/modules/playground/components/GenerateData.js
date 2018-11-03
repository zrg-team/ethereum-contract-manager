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
const FormItem = Form.Item

const TYPES = {
  address: 'address',
  bytes32: 'bytes32',
  uint: 'uint',
  uint128: 'uint128',
  uint256: 'uint256',
  bool: 'bool',
  arrayUint: 'uint array',
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
    const loading = message.loading('Action in progress..', 0)
    setTimeout(() => {
      const { params } = this.state
      const { form, onSubmit } = this.props
      loading()
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const paramTypes = []
          const paramValues = []
          params.forEach(item => {
            switch (item.type) {
              case 'bool':
                paramTypes.push(item.type)
                paramValues.push(item.value === 'true')
                break
              case 'arrayUint':
                paramTypes.push('uint[]')
                paramValues.push([...`${item.value}`.split(',')])
                break
              case 'arrayAddress':
                paramTypes.push('address[]')
                paramValues.push([...`${item.value}`.split(',')])
                break
              case 'arrayByte32':
                paramTypes.push('bytes32[]')
                paramValues.push([...`${item.value}`.split(',')])
                break
              default:
                paramTypes.push(item.type)
                paramValues.push(`${item.value}`)
                break
            }
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
          label='Function name'
        >
          {getFieldDecorator('functionName', {
            rules: [{
              required: true,
              message: 'Please input your Function Name!'
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
                  placeholder='Please select account'
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
                label='Value'
              >
                <Input
                  style={{ width: 'calc(100% - 10px)', marginLeft: '10px' }}
                  placeholder='Value'
                  onChange={(e) => this.onChangeValue(e, item)}
                />
              </Form.Item>
            </Col>
          </Row>)
        })}
        <Form.Item>
          <Button type='dashed' onClick={this.addParam} style={{ width: '100%' }}>
            <Icon type='plus' /> Add params
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(GenerateData)
