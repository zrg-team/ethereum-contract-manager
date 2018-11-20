import React from 'react'
import axios from 'axios'
const ReactMarkdown = require('react-markdown/with-html')

class About extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: ''
    }
  }
  async componentDidMount () {
    try {
      const result = await axios({
        url: 'https://raw.githubusercontent.com/zrg-team/ethereum-contract-manager/develop/README.md'
      })
      if (result) {
        this.setState({
          data: result.data
        })
      }
    } catch (err) {

    }
  }
  render () {
    const { data } = this.state
    return (
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ReactMarkdown
          skipHtml={false}
          rawSourcePos={false}
          sourcePos={false}
          escapeHtml={false}
          source={`
${data}
`}
        />
      </div>
    )
  }
}

export default About
