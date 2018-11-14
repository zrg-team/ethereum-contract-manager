import { connect } from 'react-redux'
import saveAs from 'file-saver'
import NewProject from '../components/NewForm'
import { store } from '../../../common/utils/database'
import { encrypt } from '../../../common/utils/encrypt'
import { loading } from '../../../common/middlewares/effects'
import { addProject } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  saveData: async (data, password) => {
    try {
      const result = await loading(async () => {
        let encrypted = data
        if (password) {
          encrypted = encrypt(JSON.stringify(data), password)
        }
        const defaultData = {
          name: data.general.name,
          key: new Date().getTime(),
          description: data.general.name
        }
        await store.setItem(`project_${defaultData.key}`, {
          ...defaultData,
          encrypted
        })
        dispatch(addProject(defaultData))
        const blob = new Blob([JSON.stringify({
          ...defaultData,
          encrypted
        })], {type: 'text/plain;charset=utf-8'})
        saveAs(blob, 'export.json')
        return true
      })
      return result
    } catch (err) {
      return false
    }
  }
})

const mapStateToProps = state => ({})

export default connect(mapStateToProps, mapDispatchToProps)(NewProject)
