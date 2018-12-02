import React from 'react'
import axios from 'axios'
import { Tabs } from 'antd'
const ReactMarkdown = require('react-markdown/with-html')

class About extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: '',
      document: ''
    }
  }
  async componentDidMount () {
    try {
      const about = await axios({
        url: 'https://raw.githubusercontent.com/zrg-team/ethereum-contract-manager/develop/README.md'
      })
      if (about) {
        this.setState({
          data: about.data
        })
      }
    } catch (err) {
    }
    try {
      const document = await axios({
        url: 'https://raw.githubusercontent.com/zrg-team/ethereum-contract-manager/develop/documents/SANDBOX.md'
      })
      if (document) {
        this.setState({
          document: document.data
        })
      }
    } catch (err) {
    }
  }
  render () {
    const { data, document } = this.state
    return (
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Tabs defaultActiveKey='1'>
          <Tabs.TabPane tab='ABOUT US' key='1'>
            <ReactMarkdown
              skipHtml={false}
              rawSourcePos={false}
              sourcePos={false}
              escapeHtml={false}
              source={`
${data}
`}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab='SANDBOX DOCUMENT' key='2'>
            <ReactMarkdown
              skipHtml={false}
              rawSourcePos={false}
              sourcePos={false}
              escapeHtml={false}
              source={`
${document}
`}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

export default About
