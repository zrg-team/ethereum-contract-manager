import React from 'react'
import { Tabs, Icon } from 'antd'
// import Loading from '../common/components/widgets/Loading'
import '../modules/playground/styles/playground.css'
import NewProcess from '../modules/playground/containers/NewProcess'
import PendingProcess from '../modules/playground/containers/PendingProcess'

class PlayGround extends React.Component {
  constructor (props) {
    super(props)
    this.onTabChange = this.onTabChange.bind(this)
  }
  onTabChange (key) {
    console.log('key', key)
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
          tab={<span><Icon type='file-protect' theme='outlined' />New Process</span>}
          key='1'>
          <NewProcess />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span><Icon type='file-sync' theme='outlined' />Process</span>}
          key='2'>
          <PendingProcess />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}

export default PlayGround
