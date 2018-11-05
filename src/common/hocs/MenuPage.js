import React from 'react'
import I18n from 'i18n-js'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Layout, Menu, Icon, notification } from 'antd'
const { Header, Sider, Content } = Layout

notification.config({
  placement: 'bottomLeft'
})
class MenuPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false
    }
    this.setMenus()
    this.toggle = this.toggle.bind(this)
    this.changePage = this.changePage.bind(this)
  }
  setMenus () {
    this.MENUS = [
      {
        key: 'projects',
        title: I18n.t('menu.projects'),
        icon: {
          type: 'project',
          theme: 'outlined'
        },
        redirect: '/dashboard'
      },
      {
        key: 'new-project',
        title: I18n.t('menu.new_project'),
        icon: {
          type: 'folder-add',
          theme: 'outlined'
        },
        redirect: '/new'
      },
      {
        key: 'import-project',
        title: I18n.t('menu.import_project'),
        icon: {
          type: 'download',
          theme: 'outlined'
        },
        redirect: '/import'
      },
      {
        key: 'timelife',
        title: I18n.t('menu.timelife'),
        icon: {
          type: 'sort-ascending',
          theme: 'outlined'
        },
        redirect: '/timelife'
      },
      {
        key: 'tools',
        title: I18n.t('menu.tools'),
        icon: {
          type: 'sliders',
          theme: 'outlined'
        },
        redirect: '/tools'
      },
      {
        key: 'setting',
        title: I18n.t('menu.setting'),
        icon: {
          type: 'setting',
          theme: 'outlined'
        },
        redirect: '/setting'
      },
      {
        key: 'about',
        title: I18n.t('menu.about'),
        icon: {
          type: 'info-circle',
          theme: 'outlined'
        },
        redirect: '/about'
      }
    ]
  }
  componentWillReceiveProps (nextProps) {
    const { language } = nextProps
    if (language !== this.props.language) {
      this.setMenus()
    }
  }
  changePage (e) {
    const { history } = this.props
    const item = this.MENUS.find(data => data.key === e.key)
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
    const selectedMenu = this.MENUS.find(item => item.redirect === location.pathname) ||
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
                <span>{I18n.t('menu.playground')}</span>
              </Menu.Item>
            )}
            {this.MENUS.map(item => (
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

export default connect((state) => {
  return {
    language: state.common.language
  }
})(withRouter(MenuPage))
