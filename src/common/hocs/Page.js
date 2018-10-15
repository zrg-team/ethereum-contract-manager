import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'

export default Page => {
  return props => (
    <CSSTransitionGroup
      timeout={300}
      transitionEnterTimeout={100}
      transitionLeaveTimeout={200}
      transitionName='star'
    >
      <Page {...props} />
    </CSSTransitionGroup>
  )
}
