import React, { Component } from 'react'
import { Route } from 'react-router'
import Dashboard from '../pages/Dashboard'
import NewProject from '../pages/NewProject'
import Playground from '../pages/Playground'
import ImportProject from '../pages/ImportProject'
import Tools from '../pages/Tools'
import Page from './hocs/Page'
import MenuPage from './hocs/MenuPage'
import Setting from '../pages/Setting'

export default class Root extends Component {
  render () {
    return (
      <MenuPage>
        <Route path='/' exact component={Page(Dashboard)} />
        <Route path='/dashboard' component={Page(Dashboard)} />
        <Route path='/new' component={Page(NewProject)} />
        <Route path='/import' component={Page(ImportProject)} />
        <Route path='/playground' component={Playground} />
        <Route path='/tools' component={Tools} />
        <Route path='/setting' component={Setting} />
      </MenuPage>
    )
  }
}
