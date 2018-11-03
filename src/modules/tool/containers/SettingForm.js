import { connect } from 'react-redux'
import SettingForm from '../components/SettingForm'
import { store } from '../../../common/utils/database'
import { setCurrentProject } from '../../dashboard/actions'
import { setAllTransactions, setProject } from '../../project/actions'
import { setRequestTimeout, setUserLanguage } from '../../../common/actions/common'
import { MODULE_NAME as MODULE_PROJECT } from '../../project/model'

const mapDispatchToProps = (dispatch, props) => ({
  setRequestTimeout: (timeout) => {
    dispatch(setRequestTimeout(timeout))
  },
  setUserLanguage: (language) => {
    dispatch(setUserLanguage(language))
  },
  clearAllData: (projects = []) => {
    projects.forEach(item => {
      store.removeItem(item.key)
    })
    dispatch(setCurrentProject(null))
    dispatch(setProject([]))
    dispatch(setAllTransactions({}))
  }
})

const mapStateToProps = state => {
  return {
    timeout: state.common.timeout,
    language: state.common.language,
    projects: state[MODULE_PROJECT].projects
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingForm)
