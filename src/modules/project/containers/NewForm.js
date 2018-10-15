import { connect } from 'react-redux'
import saveAs from 'file-saver'
import NewProject from '../components/NewForm'
import { store } from '../../../common/utils/database'
import { encrypt } from '../../../common/utils/encrypt'
import { loading } from '../../../common/middlewares/effects'
import { addProject } from '../actions'
import { setCurrentProject } from '../../dashboard/actions'

const mapDispatchToProps = (dispatch, props) => ({
  saveData: async (data, password) => {
    try {
      const result = await loading(async () => {
        let encypted = data
        if (password) {
          encypted = encrypt(JSON.stringify(data), password)
        }
        const defaultData = {
          name: data.general.name,
          description: data.general.name
        }
        const result = await store.setItem('project', {
          ...defaultData,
          encypted
        })
        console.log('result', result)
        dispatch(addProject(defaultData))
        dispatch(setCurrentProject({
          ...defaultData,
          ...data
        }))
        const blob = new Blob([JSON.stringify({
          ...defaultData,
          encypted
        })], {type: 'text/plain;charset=utf-8'})
        saveAs(blob, 'export.json')
      })
      return result
    } catch (err) {
      return false
    }
  }
})

const mapStateToProps = state => {
}

export default connect(mapStateToProps, mapDispatchToProps)(NewProject)
