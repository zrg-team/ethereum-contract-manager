import React, { Component } from 'react'
import { List, Row, Card, Icon, Form, Button, message } from 'antd'
import Modal from '../../../common/components/widgets/Modal'
import NewContract from '../../project/components/NewContract'
import ConfirmPassword from '../../dashboard/components/ConfirmPassword'
import '../styles/edit.css'

class EditContract extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contractsEdit: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addContract = this.addContract.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.renderContractItem = this.renderContractItem.bind(this)
  }

  componentDidMount () {
    const { contracts } = this.props.currentProject
    this.setState({ contractsEdit: [...this.state.contractsEdit, ...contracts] })
  }

  handleSubmit () {
    const { contractsEdit } = this.state
    const { match: { params }, history, saveEditContract } = this.props
    Modal.show(<ConfirmPassword
      ref={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={async (password) => {
        await saveEditContract(params.id, contractsEdit, password)
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

  handleRemoveContract (contract) {
    const { contractsEdit } = this.state
    let arrTemp = contractsEdit.filter(item => item.address !== contract.address)
    this.setState({ contractsEdit: arrTemp })
  }

  addContract () {
    Modal.show(<NewContract
      wrappedComponentRef={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={(values) => {
        const { contractsEdit } = this.state
        if (!contractsEdit.some(item => item.address === values.address)) {
          contractsEdit.push(values)
          this.setState({
            contractsEdit
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

  handleBack () {
    const { history } = this.props
    history.replace('/dashboard')
  }

  renderContractItem (item) {
    return (
      <List.Item>
        <Row>
          <Card
            actions={[
              <Icon
                type='delete'
                theme='twoTone'
                twoToneColor='#cf1322'
                onClick={() => this.handleRemoveContract(item)}
              />
            ]}
          >
            <Card.Meta
              title={item.name}
              style={{
                marginBottom: 10
              }}
            />
            <p className='break-text'>Address: {item.address}</p>
            <p className='break-text'>ABI: {`${item.abi}`.substr(0, 10)}...</p>
          </Card>
        </Row>
      </List.Item>
    )
  }

  render () {
    const { contractsEdit } = this.state
    return (
      <React.Fragment>
        <Row className='edit-row'>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              <List
                grid={{ gutter: 16, column: 2 }}
                className='list-container'
                dataSource={contractsEdit}
                renderItem={this.renderContractItem}
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
                onClick={this.addContract}
                style={{ width: '80%' }}
              >
                <Icon type='plus' /> New Contract
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

export default EditContract
