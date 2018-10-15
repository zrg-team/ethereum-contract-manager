import React, { Component } from 'react'
import { Modal } from 'antd'

let instanceModalComponent
class ModalComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isShow: false,
      params: {},
      component: undefined
    }

    this.activateModal = this.activateModal.bind(this)
    this.deactivateModal = this.deactivateModal.bind(this)
    this.getApplicationNode = this.getApplicationNode.bind(this)
  }

  activateModal (component, params) {
    this.setState({
      isShow: true,
      component,
      params
    })
  }

  deactivateModal () {
    const { deactiveCallback } = this.state
    deactiveCallback && deactiveCallback()
    this.setState({
      isShow: false,
      title: '',
      component: undefined
    })
  }

  getApplicationNode () {
    return document.getElementById('application')
  }

  componentDidMount () {
    const { global } = this.props
    if (global) {
      instanceModalComponent = this
    }
  }

  componentWillUnmount () {
    const { global } = this.props
    if (global) {
      instanceModalComponent = null
    }
  }

  render () {
    // const { classes } = this.props
    const { isShow, component, params } = this.state
    if (!isShow || !component) {
      return null
    }
    return (
      <Modal
        title='Notification'
        visible
        afterClose={this.deactivateModal}
        {...params}
      >
        {component}
      </Modal>
    )
  }
}

export default {
  Component: ModalComponent,
  show (component, params = {}) {
    instanceModalComponent && instanceModalComponent.activateModal(component, params)
  },
  hide () {
    instanceModalComponent && instanceModalComponent.deactivateModal()
  },
  getApplicationNode () {
    return (instanceModalComponent && instanceModalComponent.getApplicationNode()) || undefined
  }
}
