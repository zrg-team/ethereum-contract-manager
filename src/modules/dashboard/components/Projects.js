import React, { Component } from 'react'
import { List, Card, Icon } from 'antd'
import projectBanner from '../../../assets/images/project_banner.png'

const { Meta } = Card

class Projects extends Component {
  constructor (props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
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
            <Icon type='setting' />,
            <Icon type='edit' />,
            <Icon type='ellipsis' />
          ]}
        >
          <Meta
            title={`Project ${item.name}`}
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
