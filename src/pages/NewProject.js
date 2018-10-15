import React from 'react'
import NewForm from '../modules/project/containers/NewForm'

class NewProject extends React.Component {
  render () {
    const { history } = this.props
    return (
      <NewForm history={history} />
    )
  }
}

export default NewProject
