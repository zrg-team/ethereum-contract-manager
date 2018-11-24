import React from 'react'
import { Row, Col } from 'antd'
import CodeEditor from '../modules/compiler/containers/CodeEditor'
import CodeResult from '../modules/compiler/containers/CodeResult'

class Compiler extends React.Component {
  render () {
    const { history } = this.props
    return (
      <Row style={{ flex: 1, width: '100%' }}>
        <Col style={{ height: '100%' }} span={12}>
          <CodeEditor history={history} />
        </Col>
        <Col style={{ height: '100%' }} span={12}>
          <CodeResult history={history} />
        </Col>
      </Row>
    )
  }
}

export default Compiler
