import React from 'react'
import I18n from 'i18n-js'
import {
  Divider,
  Collapse,
  TreeSelect
} from 'antd'
import { DEFAULT_HELP_TREE, DEFAULT_HELP_DATA } from '../model'
const ReactMarkdown = require('react-markdown/with-html')

class CodeResult extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      helpType: null,
      helpData: {
        key: 'basic',
        header: 'Documents',
        data: DEFAULT_HELP_DATA['basic']
      }
    }
    this.onChangeHelpType = this.onChangeHelpType.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    const { runtime } = nextProps
    const { runtim: currentRuntime } = this.props
    if (runtime && !currentRuntime) {
      setTimeout(() => this.onChangeHelpType('api', 'Project API'), 100)
    }
  }
  onChangeHelpType (helpType, label) {
    const { runtime } = this.props
    if (helpType === 'api' && runtime) {
      let data = `
  ## Accounts:

<div style='overflow-x: scroll'>

| Index | Name | Address |
| ------- | ------- | ------- |
`
      runtime.accounts.forEach((item, index) => {
        data += `| ${index} | ${item.name} | ${item.address} |\n`
      })
      data += `
</div>

## Contracts:
`
      runtime.contracts.forEach((item) => {
        data += `
  Name: ${item.name}

  Address: ${item.address}

  Functions:

<div style='overflow-x: scroll'>

| Name | Input types | Input name | Output type | Output name |
| ------- | ------- | ------- | ------- | ------- |
`
        const abi = JSON.parse(item.abi)
        abi.forEach((functionItem) => {
          functionItem.inputs = functionItem.inputs || []
          functionItem.outputs = functionItem.outputs || []
          data += `| ${functionItem.name || ''} | ${functionItem.inputs.map(i => i.type)} | ${functionItem.inputs.map(i => i.name)} | ${functionItem.outputs.map(i => i.type)} | ${functionItem.outputs.map(i => i.name)} |\n`
        })

        data += '</div>'
      })
      return this.setState({
        helpType,
        helpData: {
          key: helpType,
          header: label,
          data
        }
      })
    }
    this.setState({
      helpType,
      helpData: {
        key: helpType,
        header: label,
        data: DEFAULT_HELP_DATA[helpType]
      }
    })
  }
  renderHelpData (data) {
    if (!data || !data.key || !data.data) {
      return null
    }
    return [
      <Divider key='header'>{data.header || ''}</Divider>,
      <ReactMarkdown
        key='content'
        skipHtml={false}
        rawSourcePos={false}
        sourcePos={false}
        escapeHtml={false}
        source={`
${data.data}
`}
      />
    ]
  }
  render () {
    const { helpData, helpType } = this.state
    const { outputs } = this.props
    let markdown = ``
    outputs && outputs.forEach(item => {
      markdown += `
${item.message}\n`
    })
    return (
      <div style={{ flex: 1, overflowY: 'auto', height: '100%', paddingLeft: 10 }}>
        <Collapse
          accordion
          defaultActiveKey={['result']}
        >
          <Collapse.Panel
            header='Result'
            key='result'
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                minHeight: '250px',
                overflowX: 'auto'
              }}
            >
              <ReactMarkdown
                skipHtml={false}
                rawSourcePos={false}
                sourcePos={false}
                escapeHtml={false}
                source={`
${markdown}
`}
              />
            </div>
          </Collapse.Panel>
          <Collapse.Panel header='Help' key='helper'>
            <TreeSelect
              style={{ width: '100%' }}
              value={helpType}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={DEFAULT_HELP_TREE}
              placeholder='What would you like to know ?'
              treeDefaultExpandAll
              onChange={this.onChangeHelpType}
            />
            {this.renderHelpData(helpData)}
          </Collapse.Panel>
        </Collapse>
      </div>
    )
  }
}

export default CodeResult
