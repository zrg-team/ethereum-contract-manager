import React from 'react'
import Projects from '../modules/dashboard/containers/Projects'

class Dashboard extends React.Component {
  render () {
    const { history } = this.props
    return (
      <Projects history={history} />
    )
  }
}

export default Dashboard
