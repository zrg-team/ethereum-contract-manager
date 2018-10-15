import React from 'react'
import ImportForm from '../modules/project/containers/ImportForm'

class ImportProject extends React.Component {
  render () {
    const { history } = this.props
    return (
      <ImportForm history={history} />
    )
  }
}

export default ImportProject
