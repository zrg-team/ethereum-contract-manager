import { connect } from 'react-redux'
import EditAccount from '../components/EditAccount'
import saveAs from 'file-saver'
import { descrypt, encrypt } from '../../../common/utils/encrypt'
import { store } from '../../../common/utils/database'
import { addProject, removeProject } from '../../project/actions'
import { loading } from '../../../common/middlewares/effects'
import { setCurrentProject } from '../../dashboard/actions'
const mapDispatchToProps = (dispatch, props) => ({
  saveEditAccount: async (id, accountsEdit, password) => {
    try {
      const result = await loading(async () => {
        const currentProject = await store.getItem(`project_${id}`)
        let scripts = null
        if (password) {
          scripts = JSON.parse(descrypt(currentProject.encrypted, password))
          delete currentProject.encrypted
        }
        const newScript = { ...scripts, accounts: [...accountsEdit] }
        let encrypted = newScript

        encrypted = encrypt(JSON.stringify(newScript), password)
        const newDefaultData = {
          name: scripts.general.name,
          key: new Date().getTime(),
          description: scripts.general.name
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
          const blob = new Blob([JSON.stringify({
            ...newDefaultData,
            encrypted
          })], { type: 'text/plain;charset=utf-8' })
          saveAs(blob, 'export.json')
          return true
        } catch (err) {
          console.error('err', err)
          return false
        }
      })
      return result
    } catch (err) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  currentProject: state['dashboard'].currentProject
})

export default connect(mapStateToProps, mapDispatchToProps)(EditAccount)
