import React from 'react'
import {
  Alert,
  Icon,
  Form,
  Radio,
  Input,
  Button,
  message,
  Collapse
} from 'antd'
import I18n from 'i18n-js'
const FormItem = Form.Item

const MODES = {
  broadcast: 1,
  ethCall: 2,
  nonce: 1,
  receipt: 1
}
class RequestConfig extends React.Component {
  constructor (props) {
    super(props)
    const { getFieldDecorator } = props.form
    this.state = {
      method: 'get',
      paramKey: '',
      headerKey: ''
    }
    this.REQUIRED = {
      broadcast: `
        * ${I18n.t('project.broadcast_required')}
      `,
      nonce: `
        * ${I18n.t('project.nonce_required')}
      `,
      ethCall: `
        * ${I18n.t('project.ethcall_address_required')} \n
        * ${I18n.t('project.ethcall_data_required')}
      `,
      receipt: `
        * ${I18n.t('project.receipt_required')}
      `
    }
    this.requiredField = MODES[props.mode]
    getFieldDecorator('params', { initialValue: [] })
    getFieldDecorator('headers', { initialValue: [] })
    this.addParam = this.addParam.bind(this)
    this.addHeader = this.addHeader.bind(this)
    this.removeParam = this.removeParam.bind(this)
    this.removeHeader = this.removeHeader.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChangeParamKey = this.onChangeParamKey.bind(this)
    this.onChangeHeaderKey = this.onChangeHeaderKey.bind(this)
  }
  onChangeHeaderKey (e) {
    this.setState({
      headerKey: e.target.value
    })
  }
  removeHeader (key) {
    const { form } = this.props
    // can use data-binding to get
    const headers = form.getFieldValue('headers')
    // We need at least one passenger
    if (headers.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      headers: headers.filter(k => k !== key)
    })
  }
  addHeader () {
    const { headerKey } = this.state
    const { form } = this.props
    // can use data-binding to get
    const headers = form.getFieldValue('headers')
    if (headers.some(item => item === `header_${headerKey}`)) {
      return message.error(I18n.t('errors.duplicate_param_name'))
    }
    const nextKeys = headers.concat(`header_${headerKey}`)
    // this.uuid++
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      headers: nextKeys
    })
    this.setState({
      headerKey: ''
    })
  }
  onChangeParamKey (e) {
    this.setState({
      paramKey: e.target.value
    })
  }
  removeParam (key) {
    const { form } = this.props
    // can use data-binding to get
    const params = form.getFieldValue('params')
    // We need at least one passenger
    if (params.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      params: params.filter(k => k !== key)
    })
  }
  addParam () {
    const { paramKey } = this.state
    const { form } = this.props
    // can use data-binding to get
    const params = form.getFieldValue('params')
    if (params.some(item => item === `param_${paramKey}`)) {
      return message.error(I18n.t('errors.duplicate_param_name'))
    }
    const nextKeys = params.concat(`param_${paramKey}`)
    // this.uuid++
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      params: nextKeys
    })
    this.setState({
      paramKey: ''
    })
  }
  handleSubmit () {
    const { form, onSubmit, mode } = this.props
    const loading = message.loading(I18n.t('common.loading_action'), 0)
    form.validateFieldsAndScroll((err, values) => {
      if (values.params.length < MODES[mode]) {
        loading()
        return message.error(I18n.t('errors.missing_required_params'))
      }
      if (!err) {
        try {
          const { method } = this.state
          onSubmit && onSubmit({
            method,
            ...values
          })
          loading()
        } catch (err) {
          loading()
          message.error(I18n.t('erors.update_request_error'))
        }
      } else {
        loading()
      }
    })
  }
  render () {
    const { paramKey, headerKey } = this.state
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 4 },
        sm: { span: 20, offset: 8 }
      }
    }
    const params = getFieldValue('params')
    const headers = getFieldValue('headers')
    return (
      <Form>
        <Alert
          message={this.REQUIRED[this.props.mode]}
          type='warning'
          closable
        />
        <FormItem
          {...formItemLayout}
          label={I18n.t('project.request_method')}
        >
          {getFieldDecorator('modifier', {
            initialValue: 'get'
          })(
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value='get'>GET</Radio.Button>
              <Radio.Button value='post'>POST</Radio.Button>
              <Radio.Button value='put'>PUT</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={I18n.t('project.response_path')}
        >
          {getFieldDecorator('response', {
            rules: [{
              required: false
            }]
          })(
            <Input placeholder={I18n.t('project.response_path_example')} />
          )}
        </FormItem>
        <Collapse>
          <Collapse.Panel header={I18n.t('project.params')} key='1'>
            {params.map((key, index) => {
              return (
                <FormItem
                  {...formItemLayout}
                  label={key.replace('param_', '')}
                  required={false}
                  key={key}
                >
                  {getFieldDecorator(`paramValues[${key}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: false,
                      whitespace: false
                    }]
                  })(
                    <Input
                      disabled={MODES[this.props.mode] > index}
                      placeholder={I18n.t('project.value')}
                      style={{ width: '60%', marginRight: 8 }}
                    />
                  )}
                  {params.length > 1 ? (
                    <Icon
                      className='dynamic-delete-button'
                      type='minus-circle-o'
                      disabled={params.length === 1}
                      onClick={() => this.removeHeader(key)}
                    />
                  ) : null}
                </FormItem>
              )
            })}
            <FormItem {...formItemLayoutWithOutLabel}>
              <Input placeholder={I18n.t('project.param_key')} onChange={this.onChangeParamKey} style={{ width: '60%', marginRight: 8 }} />
              <Button disabled={!paramKey || !`${paramKey}`.trim()} type='dashed' onClick={this.addParam} style={{ width: '60%' }}>
                <Icon type='plus' /> {I18n.t('project.add_param')}
              </Button>
            </FormItem>
          </Collapse.Panel>
          <Collapse.Panel header='Header' key='2'>
            {headers.map((key, index) => {
              return (
                <FormItem
                  {...formItemLayout}
                  label={key.replace('header_', '')}
                  required={false}
                  key={key}
                >
                  {getFieldDecorator(`headerValues[${key}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: false,
                      whitespace: false
                    }]
                  })(
                    <Input
                      placeholder='value'
                      style={{ width: '60%', marginRight: 8 }}
                    />
                  )}
                  {headers.length > 1 ? (
                    <Icon
                      className='dynamic-delete-button'
                      type='minus-circle-o'
                      disabled={headers.length === 1}
                      onClick={() => this.removeParam(key)}
                    />
                  ) : null}
                </FormItem>
              )
            })}
            <FormItem {...formItemLayoutWithOutLabel}>
              <Input placeholder={I18n.t('project.header_key')} onChange={this.onChangeHeaderKey} style={{ width: '60%', marginRight: 8 }} />
              <Button disabled={!headerKey || !`${headerKey}`.trim()} type='dashed' onClick={this.addHeader} style={{ width: '60%' }}>
                <Icon type='plus' /> {I18n.t('project.add_header')}
              </Button>
            </FormItem>
          </Collapse.Panel>
        </Collapse>
      </Form>
    )
  }
}

export default Form.create()(RequestConfig)
