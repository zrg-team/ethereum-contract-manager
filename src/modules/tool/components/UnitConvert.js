import React from 'react'
import {
  Row,
  Col,
  Form,
  Input
} from 'antd'
import { BigNumber } from 'bignumber.js'
import { convert } from 'ethereumjs-units'
const FormItem = Form.Item

const UNITS = [
  { key: 'wei', label: 'wei' },
  { key: 'kwei', label: 'kwei, babbage, femtoether' },
  { key: 'mwei', label: 'mwei, lovelace, picoether' },
  { key: 'gwei', label: 'gwei, shannon, nanoether' },
  { key: 'szabo', label: 'szabo, microether' },
  { key: 'finney', label: 'finney, milliether' },
  { key: 'ether', label: 'ether' },
  { key: 'kether', label: 'kether, grand' },
  { key: 'mether', label: 'mether' },
  { key: 'gether', label: 'gether' },
  { key: 'tether', label: 'tether' }
]
class UnitConvert extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      values: UNITS.reduce((all, item) => {
        return { ...all, [item.key]: convert(1, 'ether', item.key) }
      }, {})
    }
    this.onChangeValue = this.onChangeValue.bind(this)
  }
  onChangeValue (e, editKey) {
    let { values } = this.state
    try {
      const value = e.target.value
      if (isNaN(value)) {
        return false
      } else if (!value || !`${value}`.trim()) {
        values = UNITS.reduce((all, item) => {
          return { ...all, [item.key]: '' }
        }, {})
      } else {
        values = UNITS.reduce((all, item) => {
          return { ...all, [item.key]: new BigNumber(`${convert(value, editKey, item.key)}`).toFixed() }
        }, {})
      }
      this.setState({
        values
      })
    } catch (err) {
    }
  }
  render () {
    const { values } = this.state
    return (
      <Form layout='horizontal' style={{ flex: 1, display: 'flex' }}>
        <Row className='new-form-step' justify='center' style={{ overflowY: 'auto' }}>
          {UNITS.map(item => {
            return (
              <Col span={6} key={item.key} >
                <FormItem
                  layout='horizontal'
                  label={item.label}
                >
                  <Input
                    value={values[item.key]}
                    onChange={(e) => this.onChangeValue(e, item.key)}
                    style={{ marginLeft: 10, marginRight: 10, width: 'calc(100% - 20px)' }}
                  />
                </FormItem>
              </Col>
            )
          })}
        </Row>
      </Form>
    )
  }
}

export default UnitConvert
