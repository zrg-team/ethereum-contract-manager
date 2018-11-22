import { connect } from 'react-redux'
import ImportForm from '../components/ImportForm'
import { store } from '../../../common/utils/database'
// import { descrypt } from '../../../common/utils/encrypt'
import { loading } from '../../../common/middlewares/effects'
import { addProject, removeProject } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  importProject: async (data, password) => {
    try {
      const result = await loading(async () => {
        data = JSON.parse(data)
        const isExisted = await store.getItem(`project_${data.key}`)
        if (isExisted) {
          await store.removeItem(`project_${data.key}`)
          dispatch(removeProject(data.key))
        }
        const defaultData = {
          name: data.name,
          key: data.key,
          description: data.description
        }
        await store.setItem(`project_${defaultData.key}`, {
          ...defaultData,
          encrypted: data.encrypted
        })
        dispatch(addProject(defaultData))
        return true
      })
      return result
    } catch (err) {
      return false
    }
  }
})

const mapStateToProps = state => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ImportForm)
