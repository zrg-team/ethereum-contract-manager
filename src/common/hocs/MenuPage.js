import React from 'react'
import { withRouter } from 'react-router'
import { Layout, Menu, Icon, notification } from 'antd'
const { Header, Sider, Content } = Layout

const MENUS = [
  {
    key: 'projects',
    title: 'Projects',
    icon: {
      type: 'project',
      theme: 'outlined'
    },
    redirect: '/dashboard'
  },
  {
    key: 'new-project',
    title: 'New Project',
    icon: {
      type: 'folder-add',
      theme: 'outlined'
    },
    redirect: '/new'
  },
  {
    key: 'import-project',
    title: 'Import Project',
    icon: {
      type: 'download',
      theme: 'outlined'
    },
    redirect: '/import'
  }
]
notification.config({
  placement: 'bottomLeft'
})
class MenuPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false
    }
    this.toggle = this.toggle.bind(this)
    this.changePage = this.changePage.bind(this)
  }
  changePage (e) {
    const { history } = this.props
    const item = MENUS.find(data => data.key === e.key)
    history.push(item.redirect)
  }
  toggle () {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  render () {
    const { collapsed } = this.state
    const { children, history: { location } } = this.props
    const selectedMenu = MENUS.find(item => item.redirect === location.pathname) ||
      { key: location.pathname === '/playground' ? 'playground' : 'projects' }
    return (
      <Layout className='menu-page'>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className='logo' />
          <Menu
            theme='dark'
            mode='inline'
            onClick={this.changePage}
            selectedKeys={[selectedMenu.key]}
          >
            {location.pathname === '/playground' && (
              <Menu.Item key='playground'>
                <Icon type='code' theme='twoTone' />
                <span>Playground</span>
              </Menu.Item>
            )}
            {MENUS.map(item => (
              <Menu.Item key={item.key}>
                <Icon type={item.icon.type} theme={item.icon.theme} />
                <span>{item.title}</span>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className='trigger'
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ margin: '10px 10px', padding: 10, background: '#fff', display: 'flex', justifyContent: 'center' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(MenuPage)
