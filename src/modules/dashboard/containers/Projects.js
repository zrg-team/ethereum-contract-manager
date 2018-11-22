import { connect } from 'react-redux'
import Projects from '../components/Projects'
import { descrypt } from '../../../common/utils/encrypt'
import { removeProject } from '../../project/actions'
import { setCurrentProject } from '../actions'
import { fullnodeProcess } from '../../playground/actions'
import { store } from '../../../common/utils/database'
import { MODULE_NAME as MODULE_PROJECT } from '../../project/model'

const mapDispatchToProps = (dispatch, props) => ({
  deleteProject: async (item) => {
    try {
      await store.removeItem(`project_${item.key}`)
      dispatch(removeProject(item.key))
      return true
    } catch (err) {
      console.error('err', err)
      return false
    }
  },
  startProject: async (item, password) => {
    try {
      const data = await store.getItem(`project_${item.key}`)
      let scripts = null
      if (password) {
        scripts = JSON.parse(descrypt(data.encrypted, password))
        delete data.encrypted
      }
      dispatch(setCurrentProject({
        ...data,
        ...scripts
      }))
      dispatch(fullnodeProcess())
      return true
    } catch (err) {
      console.error('err', err)
      return false
    }
  },
  settingProject: async (item, password) => {
    try {
      const data = await store.getItem(`project_${item.key}`)
      let scripts = null
      if (password) {
        scripts = JSON.parse(descrypt(data.encrypted, password))
        delete data.encrypted
      }
      dispatch(setCurrentProject({
        ...scripts,
        ...data
      }))
      dispatch(fullnodeProcess())
      return true
    } catch (err) {
      console.error('err', err)
      return false
    }
  }
})

const mapStateToProps = state => {
  return {
    projects: state[MODULE_PROJECT].projects
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects)
