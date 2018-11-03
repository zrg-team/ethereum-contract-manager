import React, { Component } from 'react'
import MainPage from './MainPage'

export default class Root extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }

  async componentDidMount () {
    try {
      // TODO: Repare something
    } catch (error) {
      console.log('Fatal Error. Cannot Initialize.', error)
    }
  }

  render () {
    const { store, persistor, history } = this.props
    return (
      <MainPage
        store={store}
        history={history}
        persistor={persistor}
      />
    )
  }
}
