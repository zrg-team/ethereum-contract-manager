import React from 'react'
import EditGeneral from '../modules/edit/containers/EditGeneral'
class EditGeneralPage extends React.Component {
  render () {
    const { match, history } = this.props
    return (
      <EditGeneral match={match} history={history} />
    )
  }
}
export default EditGeneralPage
