import React, { Component } from 'react'
import { List, Card, Icon, Form, Row, message, Button } from 'antd'
import Modal from '../../../common/components/widgets/Modal'
import NewAccount from '../../project/components/NewAccount'
import ConfirmPassword from '../../dashboard/components/ConfirmPassword'
import '../styles/edit.css'
class EditAccount extends Component {
  constructor (props) {
    super(props)
    this.state = {
      accountsEdit: []
    }
    this.renderAccountItem = this.renderAccountItem.bind(this)
    this.addAccount = this.addAccount.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleRemoveAccount = this.handleRemoveAccount.bind(this)
  }

  componentDidMount () {
    const { accounts } = this.props.currentProject
    this.setState({ accountsEdit: [...this.state.accountsEdit, ...accounts] })
  }
  handleSubmit () {
    const { accountsEdit } = this.state
    const { match: { params }, history, saveEditAccount } = this.props
    Modal.show(<ConfirmPassword
      ref={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={async (password) => {
        await saveEditAccount(params.id, accountsEdit, password)
        Modal.hide()
        history.replace('/dashboard')
      }}
    />, {
      onOk: () => {
        this.modalRef && this.modalRef.handleSubmit()
      },
      onCancel: () => Modal.hide()
    })
  }
  handleBack () {
    const { history } = this.props
    history.replace('/dashboard')
  }
  handleRemoveAccount (account) {
    const { accountsEdit } = this.state
    let arrTemp = accountsEdit.filter(item => item.address !== account.address)
    this.setState({ accountsEdit: arrTemp })
  }
  addAccount () {
    Modal.show(<NewAccount
      wrappedComponentRef={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={(values) => {
        const { accountsEdit } = this.state
        if (!accountsEdit.some(item => item.address === values.address)) {
          accountsEdit.push(values)
          this.setState({
            accountsEdit
          }, () => Modal.hide())
        } else {
          message.error('Exist account !')
        }
      }}
    />, {
      onOk: () => {
        this.modalRef && this.modalRef.handleSubmit()
      },
      onCancel: () => Modal.hide()
    })
  }
  renderAccountItem (item) {
    return (<List.Item>
      <Row>
        <Card
          actions={[
            <Icon
              type='delete'
              theme='twoTone'
              twoToneColor='#cf1322'
              onClick={() => this.handleRemoveAccount(item)}
            />
          ]}
        >
          <Card.Meta
            title={item.name}

          />
          <p className='break-text'>Address: {item.address}</p>
          <p className='break-text'>Publickey: {`${item.publicKey}`.substr(0, 10)}...</p>
          <p className='break-text'>Privatekey: {`${item.privateKey}`.substr(0, 5)}...</p>
        </Card>
      </Row>

    </List.Item>)
  }
  render () {
    const { accountsEdit } = this.state
    return (
      <React.Fragment>
        <Row className='edit-row'>
          <Form onSubmit={this.handleSubmit} >
            <Form.Item>
              <List
                grid={{ gutter: 16, column: 2 }}
                className='list-container'
                dataSource={accountsEdit}
                renderItem={this.renderAccountItem}
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ marginRight: 5 }}
                onClick={this.handleBack}
                size='large'
                htmlType='button'
              >
                <Icon type='left' /> Back
              </Button>
              <Button
                size='large'
                type='dashed'
                onClick={this.addAccount}
                style={{ width: '80%' }}
              >
                <Icon type='plus' /> New Account
              </Button>
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                style={{ marginLeft: 5 }}
              >
                Save <Icon type='save' />
              </Button>
            </Form.Item>

          </Form>

        </Row>
      </React.Fragment>
    )
  }
}

export default (EditAccount)
