import React, { Component } from 'react'
import I18n from 'i18n-js'
import { List, Card, Icon, message, Button } from 'antd'
import Modal from '../../../common/components/widgets/Modal'
import ConfirmPassword from './ConfirmPassword'
import projectBanner from '../../../assets/images/project_banner.png'

const { Meta } = Card

class Projects extends Component {
  constructor (props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
  }
  startProject (item) {
    const { startProject, history } = this.props
    Modal.show(<ConfirmPassword
      ref={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={async (password) => {
        const result = await startProject(item, password)
        Modal.hide()
        if (result) {
          history.replace('/playground')
        }
      }}
    />, {
      onOk: () => {
        this.modalRef && this.modalRef.handleSubmit()
      },
      onCancel: () => Modal.hide()
    })
  }
  editProject (item) {
    const { settingProject, history } = this.props
    console.log('item', item)
    Modal.show(<ConfirmPassword
      ref={(ref) => {
        this.modalRef = ref
      }}
      onSubmit={async (password) => {
        const result = await settingProject(item, password)
        Modal.hide()
        if (result) {
          history.replace(`/edit/${item.key}`)
        } else {
          message.error(I18n.t('errors.wrong_password'))
        }
      }}
    />, {
      onOk: () => {
        this.modalRef && this.modalRef.handleSubmit()
      },
      onCancel: () => Modal.hide()
    })
  }
  async deleteProject (item) {
    const { deleteProject } = this.props
    const result = await deleteProject(item)
    if (result) {
      return message.success(I18n.t('messages.deleted'))
    }
    message.error(I18n.t('errors.delete_error'))
  }
  renderItem (item) {
    return (
      <List.Item>
        <Card
          cover={
            <img
              alt='projectBanner'
              src={projectBanner}
            />
          }
          actions={[
            <Button onClick={() => this.startProject(item)}>
              <Icon
                type='play-circle'
                theme='twoTone'
                twoToneColor='#1890ff'
              />
              {I18n.t('dashboard.play')}
            </Button>,
            <Button onClick={() => this.editProject(item)}><Icon type='setting' />{I18n.t('dashboard.setting')}</Button>,
            <Button onClick={() => this.deleteProject(item)}>
              <Icon
                type='delete'
                theme='twoTone'
                twoToneColor='#cf1322'
              />
              {I18n.t('dashboard.delete')}
            </Button>
          ]}
        >
          <Meta
            title={I18n.t('project.project_name', { name: item.name })}
            description={item.description}
          />
        </Card>
      </List.Item>
    )
  }
  render () {
    const { projects = [] } = this.props
    return (
      <List
        grid={{ gutter: 10, column: 3 }}
        dataSource={projects}
        renderItem={this.renderItem}
      />
    )
  }
}

export default Projects
