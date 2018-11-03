import React from 'react'
import I18n from 'i18n-js'
import {
  Row,
  Col,
  Form,
  Input
} from 'antd'
import { ripemd160, keccak256, sha256 } from 'ethereumjs-util'
const FormItem = Form.Item

class HashGenerate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      ripemd160: '',
      keccak256: '',
      sha256: ''
    }
    this.onChangeValue = this.onChangeValue.bind(this)
  }
  onChangeValue (e) {
    const value = e.target.value
    this.setState({
      value,
      ripemd160: ripemd160(value).toString('hex'),
      sha256: sha256(value).toString('hex'),
      keccak256: keccak256(value).toString('hex')
    })
  }
  render () {
    const { value, ripemd160, sha256, keccak256 } = this.state
    return (
      <Form layout='horizontal' style={{ flex: 1, display: 'flex' }}>
        <Row className='new-form-step' justify='center' style={{ overflowY: 'auto' }}>
          <Col span={12} >
            <FormItem
              layout='horizontal'
              label={I18n.t('tools.input')}
            >
              <Input.TextArea
                value={value}
                onChange={this.onChangeValue}
                style={{ marginLeft: 10, marginRight: 10, width: 'calc(100% - 20px)' }}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              layout='horizontal'
              label={'Ripemd160'}
            >
              <Input.TextArea
                value={ripemd160}
                readOnly
                style={{ marginLeft: 10, marginRight: 10, width: 'calc(100% - 20px)' }}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              layout='horizontal'
              label={'Sha256'}
            >
              <Input.TextArea
                value={sha256}
                readOnly
                style={{ marginLeft: 10, marginRight: 10, width: 'calc(100% - 20px)' }}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              layout='horizontal'
              label={'Keccak256'}
            >
              <Input.TextArea
                value={keccak256}
                readOnly
                style={{ marginLeft: 10, marginRight: 10, width: 'calc(100% - 20px)' }}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default HashGenerate
