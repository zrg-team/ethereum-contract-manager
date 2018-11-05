import React from 'react'
import { Card, Icon, Avatar, List, Spin } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import Modal from '../../../common/components/widgets/Modal'
const ReactMarkdown = require('react-markdown/with-html')

class PendingProcess extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      hasMore: false,
      data: []
    }
    this.renderItem = this.renderItem.bind(this)
    this.modalDetail = this.modalDetail.bind(this)
    this.handleInfiniteOnLoad = this.handleInfiniteOnLoad.bind(this)
  }
  async modalDetail (item) {
    const { transactions, currentProject, checkTransactionReceipt } = this.props
    try {
      if (!item.response) {
        const response = await checkTransactionReceipt(currentProject, item, transactions)
        item = response
      }
    } catch (err) {

    }
    Modal.show(<Card style={{ width: 450 }}>
      <ReactMarkdown
        skipHtml={false}
        rawSourcePos={false}
        sourcePos={false}
        escapeHtml={false}
        source={`
# **PARAMS**

---

${JSON.stringify(item.params || {})}

# **ACCOUNT**

---

${JSON.stringify(item.account || {})}

# **EVENTS**

---

${JSON.stringify(item.response || {})}
`}
      />
    </Card>, {
      onOk: () => {
        Modal.hide()
      },
      onCancel: () => Modal.hide()
    })
  }
  renderItem (item) {
    const { general } = this.props
    return (
      <List.Item
        key={item.transactionId}
        actions={[
          <Icon type='appstore' theme='twoTone' onClick={() => { this.modalDetail(item) }} />
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar src='https://png.icons8.com/color/1600/ethereum.png' />}
          title={<a target='_blank' rel='noopener noreferrer' href={`${general.insightUrl}${item.transactionId}`}>{item.transactionId}</a>}
          description={`${item.contract.name} - ${item.contractFunction.name}`}
        />
        <div>{item.response ? <Icon type='tags' theme='twoTone' twoToneColor='#52c41a' /> : <Icon type='loading' />}</div>
      </List.Item>
    )
  }
  handleInfiniteOnLoad () {
  }
  render () {
    const { transactions } = this.props
    const { loading, hasMore } = this.state
    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={this.handleInfiniteOnLoad}
        hasMore={!loading && hasMore}
        useWindow={false}
      >
        <List
          dataSource={transactions}
          renderItem={this.renderItem}
          
        >
          {loading && hasMore && (
            <div className='demo-loading-container'>
              <Spin />
            </div>
          )}
        </List>
      </InfiniteScroll>
    )
  }
}

export default PendingProcess
