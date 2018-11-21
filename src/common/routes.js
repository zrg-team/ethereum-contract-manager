import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import Dashboard from '../pages/Dashboard'
import NewProject from '../pages/NewProject'
import ProjectPlayground from '../pages/ProjectPlayground'
import ImportProject from '../pages/ImportProject'
import Tools from '../pages/Tools'
import Page from './hocs/Page'
import MenuPage from './hocs/MenuPage'
import Setting from '../pages/Setting'
// import UnderContruct from '../pages/UnderContruct'
import About from '../pages/About'
import CodeEditorPage from '../pages/CodeEditor'
import EditProject from '../pages/EditProject'

export default class Root extends Component {
  render () {
    return (
      <MenuPage>
        <Route path='/' exact component={Page(Dashboard)} />
        <Route path='/dashboard' component={Page(Dashboard)} />
        <Route path='/new' component={Page(NewProject)} />
        <Route path='/import' component={Page(ImportProject)} />
        <Route path='/playground' component={ProjectPlayground} />
        <Route path='/tools' component={Tools} />
        <Route path='/setting' component={Setting} />
        <Route path='/timelife' component={CodeEditorPage} />
        <Route path='/about' component={About} />
        <Route path='/edit/:id' component={EditProject} />
      </MenuPage>
    )
  }
}
