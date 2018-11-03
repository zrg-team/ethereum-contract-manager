import React from 'react'
import SettingForm from '../modules/tool/containers/SettingForm'

class Setting extends React.Component {
  render () {
    const { history } = this.props
    return (
      <SettingForm history={history} />
    )
  }
}

export default Setting
