import React from 'react'
import I18n from 'i18n-js'
import { Tabs, Icon } from 'antd'
// import Loading from '../common/components/widgets/Loading'
import '../modules/playground/styles/playground.css'
import EditAccount from '../modules/edit/containers/EditAccount'
import EditContract from '../modules/edit/containers/EditContract'
import EditGeneral from '../modules/edit/containers/EditGeneral'

class EditProject extends React.Component {
  constructor (props) {
    super(props)
    this.onTabChange = this.onTabChange.bind(this)
  }
  onTabChange (key) {
  }
  render () {
    const { match, history } = this.props
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
          tab={<span><Icon type='file-protect' theme='outlined' />{I18n.t('project.general')}</span>}
          key='1'>
          <EditGeneral match={match} history={history} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span><Icon type='team' theme='outlined' />{I18n.t('project.accounts')}</span>}
          key='3'>
          <EditAccount match={match} history={history} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span><Icon type='snippets' theme='outlined' />{I18n.t('project.contracts')}</span>}
          key='4'>
          <EditContract match={match} history={history} />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}

export default EditProject
