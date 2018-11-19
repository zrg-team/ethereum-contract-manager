import React, { Component } from 'react'
import { Select, Form, Button } from 'antd'
import Modal from '../../../common/components/widgets/Modal'
import ConfirmPassword from '../../dashboard/components/ConfirmPassword'
const Option = Select.Option
const Item = Form.Item

class EditOption extends Component {
  constructor (props) {
    super(props)
    this.state = {
      option: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange (value) {
    this.setState({ option: value })
  }
  handleSubmit (e) {
    e.preventDefault()
    const { match: { params }, history, editOption } = this.props
    const { option } = this.state
    switch (option) {
      case 'accounts':
        Modal.show(<ConfirmPassword
          ref={(ref) => {
            this.modalRef = ref
          }}
          onSubmit={async (password) => {
            await editOption(params.id, password)
            Modal.hide()
            history.replace(`/accounts/${params.id}`)
          }}
        />, {
          onOk: () => {
            this.modalRef && this.modalRef.handleSubmit()
          },
          onCancel: () => Modal.hide()
        })
        break
      case 'contracts':
        Modal.show(<ConfirmPassword
          ref={(ref) => {
            this.modalRef = ref
          }}
          onSubmit={async (password) => {
            await editOption(params.id, password)
            Modal.hide()
            history.replace(`/contracts/${params.id}`)
          }}
        />, {
          onOk: () => {
            this.modalRef && this.modalRef.handleSubmit()
          },
          onCancel: () => Modal.hide()
        })
        break
      case 'general':
        Modal.show(<ConfirmPassword
          ref={(ref) => {
            this.modalRef = ref
          }}
          onSubmit={async (password) => {
            await editOption(params.id, password)
            Modal.hide()
            history.replace(`/general/${params.id}`)
          }}
        />, {
          onOk: () => {
            this.modalRef && this.modalRef.handleSubmit()
          },
          onCancel: () => Modal.hide()
        })
        break
      default:
        break
    }
  }
  render () {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Item>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder='Select option to change'
            optionFilterProp='children'
            onChange={this.handleChange}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option value='general'>General</Option>
            <Option value='accounts'>Account</Option>
            <Option value='contracts'>Contract</Option>
          </Select>
        </Item>
        <Item>
          <Button type='primary' htmlType='submit'>Submit</Button>
        </Item>
      </Form>
    )
  }
}
export default EditOption
