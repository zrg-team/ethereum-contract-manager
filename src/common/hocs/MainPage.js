import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Routes from '../routes'
import Modal from '../components/widgets/Modal'
import PageLoading from '../components/widgets/PageLoading'
import ProgressLoading from '../components/widgets/ProgressLoading'

export default class Main extends Component {
  shouldComponentUpdate (nextProps) {
    return false
  }
  render () {
    const { store, persistor } = this.props
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <React.Fragment>
            <BrowserRouter>
              <Routes store={store} />
            </BrowserRouter>
            <ProgressLoading.Component />
            <PageLoading.Component type='bars' />
            <Modal.Component global />
          </React.Fragment>
        </PersistGate>
      </Provider>
    )
  }
}
