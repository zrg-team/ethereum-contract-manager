import { connect } from 'react-redux'
import ImportForm from '../components/ImportForm'
import { store } from '../../../common/utils/database'
// import { descrypt } from '../../../common/utils/encrypt'
import { loading } from '../../../common/middlewares/effects'
import { addProject } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  importProject: async (data, password) => {
    try {
      const result = await loading(async () => {
        data = JSON.parse(data)
        // let decypted = ''
        // if (password) {
        //   decypted = descrypt(data.encrypted, password)
        // }
        // console.log('decypted', data)
        // decypted = JSON.parse(decypted)
        const defaultData = {
          name: data.name,
          key: new Date().getTime(),
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
