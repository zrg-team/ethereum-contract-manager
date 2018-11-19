import React, { Fragment } from 'react'
import {
  Icon,
  Row,
  Input
} from 'antd'
import I18n from 'i18n-js'

class ConfirmPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      password: ''
    }
    this.process = false
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
  }
  onChangePassword (e) {
    this.setState({ password: e.target.value })
  }
  handleSubmit () {
    const { password } = this.state
    const { onSubmit } = this.props
    onSubmit && onSubmit(password)
  }
  render () {
    const { password } = this.state
    return (
      <Fragment>
        <Row
          style={{ marginBottom: 15 }}
          className='center-container'
          justify='center'
          align='center'
        >
          <Input
            value={password}
            type={'password'}
            onChange={this.onChangePassword}
            style={{ width: 500 }}
            placeholder={I18n.t('common.password')}
            prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </Row>
      </Fragment>
    )
  }
}

export default ConfirmPassword
