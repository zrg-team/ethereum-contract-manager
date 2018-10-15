import React, { Component } from 'react'
import { Route } from 'react-router'
import Dashboard from '../pages/Dashboard'
import NewProject from '../pages/NewProject'
import ImportProject from '../pages/ImportProject'
import Page from './hocs/Page'
import MenuPage from './hocs/MenuPage'

export default class Root extends Component {
  render () {
    return (
      <MenuPage>
        <Route path='/' exact component={Page(Dashboard)} />
        <Route path='/dashboard' component={Page(Dashboard)} />
        <Route path='/new' component={Page(NewProject)} />
        <Route path='/import' component={Page(ImportProject)} />
      </MenuPage>
    )
  }
}
