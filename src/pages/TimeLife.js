import React from 'react'
import { Row, Col } from 'antd'
import CodeEditor from '../modules/timelife/containers/CodeEditor'
import CodeResult from '../modules/timelife/containers/CodeResult'

class TimeLife extends React.Component {
  render () {
    const { history } = this.props
    return (
      <Row style={{ flex: 1 }}>
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

export default TimeLife
