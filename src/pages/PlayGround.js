import React from 'react'
import I18n from 'i18n-js'
import { Tabs, Icon } from 'antd'
// import Loading from '../common/components/widgets/Loading'
import '../modules/playground/styles/playground.css'
import Send from '../modules/playground/containers/Send'
import Accounts from '../modules/playground/containers/Accounts'
import NewProcess from '../modules/playground/containers/NewProcess'
import PendingProcess from '../modules/playground/containers/PendingProcess'

class Playground extends React.Component {
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
          tab={<span><Icon type='file-protect' theme='outlined' />{I18n.t('playground.new_process')}</span>}
          key='1'>
          <NewProcess />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span><Icon type='file-sync' theme='outlined' />{I18n.t('playground.process')}</span>}
          key='2'>
          <PendingProcess />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span><Icon type='team' theme='outlined' />{I18n.t('playground.accounts')}</span>}
          key='3'>
          <Accounts />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span><Icon type='cloud-upload' theme='outlined' />{I18n.t('playground.send')}</span>}
          key='4'>
          <Send />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}

export default Playground
