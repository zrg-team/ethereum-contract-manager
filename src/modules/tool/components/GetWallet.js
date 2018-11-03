import React, { Fragment } from 'react'
import I18n from 'i18n-js'
import {
  Form,
  Card,
  Button
} from 'antd'
import Modal from '../../../common/components/widgets/Modal'
import RestoreWallet from '../../project/components/NewAccount'
const ReactMarkdown = require('react-markdown/with-html')

class GetWallet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.onSubmit = this.onSubmit.bind(this)
    this.submit = this.submit.bind(this)
  }
  onSubmit (values) {
    Modal.show(<Card style={{ width: 450 }}>
      <ReactMarkdown
        skipHtml={false}
        rawSourcePos={false}
        sourcePos={false}
        escapeHtml={false}
        source={`
## **${I18n.t('common.address').toUpperCase()}**

---

${values.address}

## **${I18n.t('common.public_key').toUpperCase()}**

---

${values.publicKey}

## **${I18n.t('common.private_key').toUpperCase()}**

---

${values.privateKey}

## **${I18n.t('common.keystore').toUpperCase()}**

---

${values.v3String}
`}
      />
    </Card>, {
      onOk: () => {
        Modal.hide()
      },
      onCancel: () => Modal.hide()
    })
  }
  submit () {
    this.restoreRef && this.restoreRef.handleSubmit()
  }
  render () {
    return (
      <Fragment>
        <RestoreWallet
          account={false}
          v3String
          onSubmit={this.onSubmit}
          wrappedComponentRef={ref => {
            this.restoreRef = ref
          }}
        />
        <Form.Item style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Button onClick={this.submit}> {I18n.t('tools.get_wallet')} </Button>
        </Form.Item>
      </Fragment>
    )
  }
}

export default GetWallet
