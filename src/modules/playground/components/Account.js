import React from 'react'
import { message, Button, Avatar, List } from 'antd'
import { formatCrypto } from '../../../common/utils/format'
import AccountIcon from '../../../assets/images/account.png'

class Account extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      balances: {}
    }
    this.renderItem = this.renderItem.bind(this)
    this.syncProcess = this.syncProcess.bind(this)
    this.onRefreshBalance = this.onRefreshBalance.bind(this)
  }
  async syncProcess () {
    const { getAllBalance, accounts } = this.props
    const loading = message.loading('loading ...')
    const balances = await getAllBalance(accounts)
    loading()
    if (balances) {
      this.setState({
        balances
      })
    }
  }
  async componentDidMount () {
    this.syncProcess()
  }
  onRefreshBalance () {
    this.syncProcess()
  }
  renderItem (item) {
    const { balances } = this.state
    return (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={AccountIcon} />}
          title={item.name}
          description={item.address}
        />
        <div>{balances[item.address] ? formatCrypto(balances[item.address]) : '0'} ETH</div>
      </List.Item>
    )
  }
  render () {
    const { loading } = this.state
    const { accounts } = this.props
    const refresh = !loading ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        <Button onClick={this.onRefreshBalance}>Refresh</Button>
      </div>
    ) : null
    return (
      <List
        dataSource={accounts}
        renderItem={this.renderItem}
        loadMore={refresh}
      />
    )
  }
}

export default Account
