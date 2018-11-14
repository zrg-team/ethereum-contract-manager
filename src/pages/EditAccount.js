import React from 'react'
import EditAccount from '../modules/edit/containers/EditAccount'
class EditAccountPage extends React.Component {
  render () {
    console.log('this.props', this.props)
    const { match, history } = this.props
    return (
      <EditAccount match={match} history={history} />
    )
  }
  
}

export default EditAccountPage