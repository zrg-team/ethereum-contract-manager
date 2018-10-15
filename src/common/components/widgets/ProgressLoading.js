import React, { Component } from 'react'
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'

let instanceProgressLoading = null
class ProgressLoading extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render () {
    return (
      <Loading
        show={this.state.show}
        color='red'
      />
    )
  }

  show () {
    this.setState({
      show: true
    })
  }

  hide () {
    this.setState({
      show: false
    })
  }
}

export default {
  Component: ProgressLoading,
  show () {
    instanceProgressLoading && instanceProgressLoading.show()
  },
  hide () {
    instanceProgressLoading && instanceProgressLoading.hide()
  },
  hideAll () {
    instanceProgressLoading && instanceProgressLoading.hideAll()
  },
  isVisible () {
    return instanceProgressLoading && instanceProgressLoading.isVisible()
  }
}
