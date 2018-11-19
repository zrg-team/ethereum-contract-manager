import React from 'react'
import I18n from 'i18n-js'
import {
  Steps,
  Row,
  Col,
  Icon,
  Card,
  Select,
  Input,
  Form,
  Button,
  message,
  notification
} from 'antd'
import Modal from '../../../common/components/widgets/Modal'
const ReactMarkdown = require('react-markdown/with-html')

class NewProcess extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 0,
      values: {},
      result: null,
      inputs: [],
      valueSend: ''
    }
    this.setStep = this.setStep.bind(this)
    this.nextStep = this.nextStep.bind(this)
    this.checkStep = this.checkStep.bind(this)
    this.renderStep = this.renderStep.bind(this)
    this.renderStepName = this.renderStepName.bind(this)
    this.onChangeValueSend = this.onChangeValueSend.bind(this)
    this.onChangeParamInput = this.onChangeParamInput.bind(this)
    this.handleChangeAccount = this.handleChangeAccount.bind(this)
    this.handleChangeContract = this.handleChangeContract.bind(this)
    this.handleChangeFunction = this.handleChangeFunction.bind(this)
  }
  componentDidMount () {
    const { repareContracts, currentProject } = this.props
    repareContracts(currentProject)
  }
  onChangeValueSend (event) {
    this.setState({
      valueSend: event.target.value
    })
  }
  setStep (step) {
    this.setState({
      step
    })
  }
  checkStep (currentStep) {
    const { step } = this.state
    if (+currentStep < +step) {
      return 'finish'
    } else if (+currentStep > +step) {
      return 'wait'
    } else {
      return 'process'
    }
  }
  renderStepName (step) {
    switch (step) {
      case 0:
        return I18n.t('playground.contract')
      case 1:
        return I18n.t('playground.method')
      case 2:
        return I18n.t('playground.user')
      case 3:
        return I18n.t('playground.output')
      default:
        return ''
    }
  }
  async nextStep () {
    const { valueSend, inputs, step, values } = this.state
    const {
      fetchViewData,
      currentProject,
      submitTimelife,
      submitFunctionTransaction,
      getNonceAddress,
      createRawTransaction
    } = this.props
    let result = null
    switch (step) {
      case 0:
        this.setState({
          step: +step + 1
        })
        break
      case 1:
        if (values.contractFunction && (
          values.contractFunction.stateMutability === 'payable' ||
          values.contractFunction.payable ||
          values.contractFunction.stateMutability === 'nonpayable'
        )) {
          return this.setState({
            step: +step + 1
          })
        }
        result = await fetchViewData(currentProject, {
          address: values.contract.address,
          name: values.contractFunction.name,
          outputs: values.contractFunction.outputs,
          inputs: values.contractFunction.inputs.map(item => item.type),
          params: inputs
        })
        if (!result) {
          return message.error(I18n.t('errors.function_call_error'))
        }
        let markdown = `
# **${I18n.t('playground.output').toUpperCase()}**

---

${I18n.t('playground.function_name')}: ${values.contractFunction.name}

${I18n.t('playground.input').toUpperCase()}: ${inputs.join(', ')}

${I18n.t('playground.output')}:

<div style='overflow-x: scroll'>

| ${I18n.t('playground.index')} | ${I18n.t('playground.name')} | ${I18n.t('playground.type')} | ${I18n.t('playground.value')} | ${I18n.t('playground.raw')} |
| ------- | ------- | ------- | ------- | ------- |
 `

        result.forEach((item, index) => {
          markdown += `| ${index} | ${item.name} | ${item.type} | ${item.value} | ${item.raw} |\n`
        })

        markdown += ' </div> '
        this.setState({
          result: markdown,
          step: 3,
          inputs: []
        })
        break
      case 2:
        const nonce = await getNonceAddress(currentProject, values)
        if (isNaN(nonce)) {
          return message.error(I18n.t('errors.can_not_get_nonce'))
        }
        const params = {
          to: values.contract.address,
          from: values.account.address,
          value: `${valueSend}`.toString(16) || 0x0,
          nonce,
          gasLimit: 8000000,
          gasPrice: 20 * 1000000000,
          functionName: values.contractFunction.name,
          privateKey: values.account.privateKey,
          typeParams: values.contractFunction.inputs.map(item => item.type),
          functionParams: inputs
        }
        const raw = createRawTransaction(params)
        Modal.show((
          <ReactMarkdown
            skipHtml={false}
            rawSourcePos={false}
            sourcePos={false}
            escapeHtml={false}
            source={`
<pre>
{
  ${I18n.t('playground.to')}: ${params.to},
  ${I18n.t('playground.from')}: ${params.from},
  ${I18n.t('playground.value')}: ${params.value},
  ${I18n.t('playground.nonce')}: ${params.nonce},
  ${I18n.t('playground.gas_limit')}: ${params.gasLimit},
  ${I18n.t('playground.gas_price')}: ${params.gasPrice},
  ${I18n.t('playground.private_key')}: ${params.privateKey},
  ${I18n.t('playground.function_name')}: ${params.functionName},
  ${I18n.t('playground.type_params')}: ${params.typeParams.join(',')},
  ${I18n.t('playground.function_params')}: ${params.functionParams.join(',')},
}
${I18n.t('playground.raw_data')}:
${raw}

</pre>
              `}
            />), {
              onOk: async () => {
                result = await submitFunctionTransaction(currentProject, values, raw)
                submitTimelife(result, currentProject, {
                  params,
                  account: {
                    name: values.account.name,
                    address: values.account.address
                  },
                  contractFunction: values.contractFunction,
                  contract: {
                    name: values.contract.name,
                    events: values.contract.events,
                    address: values.contract.address
                  },
                  raw
                })
                Modal.hide()
                if (result) {
                  return notification.success({
                    message: I18n.t('messages.transaction_success'),
                    description: result
                  })
                }
                message.error(I18n.t('errors.transaction_error'))
              },
              onCancel: () => Modal.hide()
            })
        break
      default:
        return ''
    }
  }
  handleChangeContract (value) {
    const { values } = this.state
    const { currentProject, parseAbi } = this.props
    const contract = currentProject.contracts
      .find(item => item.address === value)
    const abi = JSON.parse(contract.abi)
    const parsedAbi = parseAbi(abi)
    this.setState({
      values: {
        ...values,
        contract: {
          name: contract.name,
          address: contract.address,
          abi,
          ...parsedAbi
        }
      }
    })
  }
  handleChangeAccount (value) {
    const { values } = this.state
    const { currentProject } = this.props
    const account = currentProject.accounts
      .find(item => item.address === value)
    this.setState({
      values: {
        ...values,
        account
      }
    })
  }
  handleChangeFunction (value) {
    const { values } = this.state
    const contractFunction = values.contract.abi
      .find(item => item.name === value)
    this.setState({
      values: {
        ...values,
        contractFunction
      }
    })
  }
  onChangeParamInput (key, event) {
    const { inputs } = this.state
    inputs[key] = event.target.value
    this.setState({
      inputs
    })
  }
  renderStep (step) {
    const { valueSend, inputs, result, values } = this.state
    const { currentProject } = this.props
    switch (step) {
      case 0:
        return (
          <Card
            title={this.renderStepName(step)}
            style={{ width: 300 }}
            actions={[
              <Button type='primary' size='large' onClick={this.nextStep}>
                <Icon
                  type='check'
                  theme='outlined'
                />
                {I18n.t('common.confirm')}
              </Button>
            ]}
          >
            <Select
              showSearch
              value={values.contract
                ? values.contract.address : null}
              style={{ width: 250 }}
              placeholder={I18n.t('playground.select_contract')}
              optionFilterProp='children'
              onChange={this.handleChangeContract}
            >
              {currentProject.contracts.map(item => {
                return (
                  <Select.Option key={item.address} value={item.address}>
                    {item.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Card>
        )
      case 1:
        return (
          <Card
            title={this.renderStepName(step)}
            style={{ width: 300 }}
            actions={[
              <Button type='primary' size='large' onClick={this.nextStep}>
                <Icon
                  type='check'
                  theme='outlined'
                />
                {I18n.t('common.confirm')}
              </Button>
            ]}
          >
            <Form.Item key={`function_selecter`}>
              <Select
                showSearch
                value={values.contractFunction
                  ? values.contractFunction.name : null}
                style={{ width: 250 }}
                placeholder={I18n.t('playground.select_function')}
                optionFilterProp='children'
                onChange={this.handleChangeFunction}
              >
                <Select.OptGroup key='Views' label='Views'>
                  {values.contract.views.map((item, index) => {
                    return (
                      <Select.Option key={`variable_${item.name}_${index}`} value={item.name}>
                        {item.name}
                      </Select.Option>
                    )
                  })}
                </Select.OptGroup>
                <Select.OptGroup key='Functions' label='Functions'>
                  {values.contract.functions.map((item, index) => {
                    return (
                      <Select.Option key={`function_${item.name}_${index}`} value={item.name}>
                        {item.name}
                      </Select.Option>
                    )
                  })}
                </Select.OptGroup>
              </Select>
            </Form.Item>
            {values.contractFunction
            ? values.contractFunction.inputs.length
              ? values.contractFunction.inputs.map((item, index) => {
                return (
                  <Form.Item key={`${item.type}_${index}`}>
                    <Input
                      placeholder={item.type}
                      value={inputs[index] ? `${inputs[index]}` : ''}
                      onChange={(event) => this.onChangeParamInput(index, event)}
                    />
                  </Form.Item>
                )
              })
              : <p>{I18n.t('messages.no_param_required')}</p>
            : null}
          </Card>
        )
      case 2:
        return (
          <Card
            title={this.renderStepName(step)}
            style={{ width: 300 }}
            actions={[
              <Button type='primary' size='large' onClick={this.nextStep}>
                <Icon
                  type='check'
                  theme='outlined'
                />
                {I18n.t('common.confirm')}
              </Button>
            ]}
          >
            <Select
              showSearch
              value={values.account
                ? values.account.address : null}
              style={{ width: 250 }}
              placeholder={I18n.t('playground.select_user')}
              optionFilterProp='children'
              onChange={this.handleChangeAccount}
            >
              {currentProject.accounts.map(item => {
                return (
                  <Select.Option key={item.address} value={item.address}>
                    {item.name}
                  </Select.Option>
                )
              })}
            </Select>
            <Form.Item key={`value_send`}>
              <Input
                placeholder={I18n.t('playground.value')}
                value={valueSend}
                onChange={this.onChangeValueSend}
              />
            </Form.Item>
            
          </Card>
        )
      case 3:
        return result ? (
          <div className='result-pane'>
            <ReactMarkdown
              skipHtml={false}
              rawSourcePos={false}
              sourcePos={false}
              escapeHtml={false}
              source={result}
            />
          </div>
        ) : null
      default:
        return null
    }
  }
  componentWillUnmount () {
    const { stopPlayground } = this.props
    stopPlayground()
    message.info(I18n.t('messages.playground_stop'))
  }
  render () {
    const { step } = this.state

    return (
      <Row style={{ flex: 1, display: 'flex', width: '100%' }}>
        <Col span={18} push={6} style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div className='steps-content'>
            {this.renderStep(step)}
          </div>
        </Col>
        <Col span={6} pull={18}>
          <Steps direction='vertical' size='small' current={step}>
            <Steps.Step
              status={this.checkStep(0)}
              title={I18n.t('playground.contract')}
              onClick={() => this.setStep(0)}
              description={I18n.t('playground.contract_message')}
              icon={<Icon type='contacts' theme='outlined' />}
            />
            <Steps.Step
              status={this.checkStep(1)}
              title={I18n.t('playground.method')}
              onClick={() => step > 1 && this.setStep(1)}
              description={I18n.t('playground.method_message')}
              icon={<Icon type='form' theme='outlined' />}
            />
            <Steps.Step
              status={this.checkStep(2)}
              title={I18n.t('playground.user')}
              onClick={() => step > 2 && this.setStep(2)}
              description={I18n.t('playground.user_message')}
              icon={<Icon type='user' theme='outlined' />}
            />
            <Steps.Step
              status={this.checkStep(3)}
              title={I18n.t('playground.output')}
              onClick={() => step > 3 && this.setStep(3)}
              description={I18n.t('playground.output_message')}
              icon={<Icon type='profile' theme='outlined' />}
            />
          </Steps>
        </Col>
      </Row>
    )
  }
}

export default NewProcess
