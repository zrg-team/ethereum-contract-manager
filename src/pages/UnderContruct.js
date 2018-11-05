import React, { Fragment } from 'react'
import Loading from '../common/components/widgets/Loading'

class UnderContruct extends React.Component {
  render () {
    return (
      <Fragment>
        <Loading />
        <p style={{
          position: 'absolute',
          fontSize: 30,
          fontWeight: 'bold'
        }}>Under contruct</p>
      </Fragment>
    )
  }
}

export default UnderContruct
