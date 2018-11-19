import { connect } from 'react-redux'
import EditGeneral from '../components/EditGeneral'
import { descrypt, encrypt } from '../../../common/utils/encrypt'
import { store } from '../../../common/utils/database'
import { addProject, removeProject } from '../../project/actions'
import { loading } from '../../../common/middlewares/effects'
import { setCurrentProject } from '../../dashboard/actions'

const mapDispatchToProps = (dispatch, props) => ({
  saveEditGeneral: async (id, newGeneral, password) => {
    try {
      const result = await loading(async () => {
        const currentProject = await store.getItem(`project_${id}`)
        let scripts = null
        if (password) {
          scripts = JSON.parse(descrypt(currentProject.encrypted, password))
          delete currentProject.encrypted
        }
        const newScript = { ...scripts, general: newGeneral }
        let encrypted = newScript

        encrypted = encrypt(JSON.stringify(newScript), password)
        const newDefaultData = {
          name: newScript.general.name,
          key: new Date().getTime(),
          description: newScript.general.name
        }
        await store.setItem(`project_${newDefaultData.key}`, {
          ...newDefaultData,
          encrypted
        })
        dispatch(addProject(newDefaultData))
        dispatch(setCurrentProject({
          ...newDefaultData,
          ...newScript
        }))
        try {
          await store.removeItem(`project_${id}`)
          dispatch(removeProject(+id))
          return true
        } catch (err) {
          console.error('err', err)
          return false
        }
      })
      return result
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = (state) => ({
  currentProject: state['dashboard'].currentProject
})

export default connect(mapStateToProps, mapDispatchToProps)(EditGeneral)
