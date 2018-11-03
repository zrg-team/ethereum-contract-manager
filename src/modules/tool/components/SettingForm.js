import React from 'react'
import I18n from 'i18n-js'
import {
  Icon,
  Radio,
  Form,
  Button,
  message,
  InputNumber
} from 'antd'
const FormItem = Form.Item

class SettingForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.clearAll = this.clearAll.bind(this)
    this.changeTimeout = this.changeTimeout.bind(this)
    this.changeLanguage = this.changeLanguage.bind(this)
  }
  clearAll () {
    const { projects, clearAllData } = this.props
    clearAllData(projects)
    message.success(I18n.t('messages.deleted_all'))
  }
  changeTimeout (value) {
    const { setRequestTimeout } = this.props
    setRequestTimeout(value.target.value)
    message.success(I18n.t('messages.timeout_updated'))
  }
  changeLanguage (value) {
    const { setUserLanguage } = this.props
    setUserLanguage(value.target.value)
    message.success(I18n.t('messages.language_updated'))
  }
  render () {
    const { language, timeout } = this.props
    return (
      <Form layout='horizontal'>
        <FormItem
          label={I18n.t('tools.language')}
        >
          <Radio.Group value={language} onChange={this.changeLanguage}>
            <Radio value='en'>{I18n.t('tools.english')}</Radio>
            <Radio value='vi'>{I18n.t('tools.vietnamese')}</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          label={I18n.t('tools.timeout')}
        >
          <InputNumber defaultValue={timeout} onBlur={this.changeTimeout} />
        </FormItem>
        <FormItem
          label={I18n.t('tools.clear_data')}
        >
          <Button
            color='#eb2f96'
            onClick={this.clearAll}
          >
            <Icon type='delete' theme='twoTone' twoToneColor='#eb2f96' /> {I18n.t('tools.delete_all').toUpperCase()}
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default SettingForm
