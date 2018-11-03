import React from 'react'
import I18n from 'i18n-js'
import { Tabs, Icon } from 'antd'
import '../modules/playground/styles/playground.css'
import UnitConvert from '../modules/tool/components/UnitConvert'
import GetWallet from '../modules/tool/components/GetWallet'
import HashGenerate from '../modules/tool/components/HashGenerate'
import GenerateTransaction from '../modules/tool/containers/GenerateTransaction'

class Tools extends React.Component {
  constructor (props) {
    super(props)
    this.onTabChange = this.onTabChange.bind(this)
  }
  onTabChange (key) {
  }
  render () {
    return (
      <Tabs
        style={{
          flex: '1',
          flexDirection: 'column',
          display: 'flex'
        }}
        defaultActiveKey='1'
        onChange={this.onTabChange}
      >
        <Tabs.TabPane
          style={{
            flexDirection: 'row',
            display: 'flex'
          }}
          tab={<span><Icon type='money-collect' theme='outlined' />{I18n.t('tools.unit_convert')}</span>}
          key='1'>
          <UnitConvert />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span><Icon type='unlock' theme='outlined' />{I18n.t('tools.get_wallet')}</span>}
          key='2'>
          <GetWallet />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span><Icon type='team' theme='outlined' />{I18n.t('tools.transaction')}</span>}
          key='3'>
          <GenerateTransaction />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span><Icon type='heat-map' theme='outlined' />{I18n.t('tools.hash_function')}</span>}
          key='4'>
          <HashGenerate />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}

export default Tools
