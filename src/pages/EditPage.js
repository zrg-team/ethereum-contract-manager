import React from 'react'
import EditOption from '../modules/edit/components/EditOption'
class EditProject extends React.Component {
  render () {
    const { match, history } = this.props
    return (
      <EditOption history={history} match={match} />
    )
  }
}

export default EditProject
