import React from 'react'
import EditContract from '../modules/edit/containers/EditContract'
class EditContractPage extends React.Component {
  render () {
    const { match, history } = this.props
    return (
      <EditContract match={match} history={history} />
    )
  }
}
export default EditContractPage
