import { connect } from 'react-redux'
import EditOption from '../components/EditOption'
import { descrypt } from '../../../common/utils/encrypt'
import { store } from '../../../common/utils/database'
import { setCurrentProject } from '../../dashboard/actions'
const mapDispatchToProps = (dispatch, props) => ({
  editOption: async (id, password) => {
    try {
      const data = await store.getItem(`project_${id}`)
      console.log('data', data)
      let scripts = null
      if (password) {
        scripts = JSON.parse(descrypt(data.encrypted, password))
        delete data.encrypted
      }
      dispatch(setCurrentProject({
        ...data,
        ...scripts
      }))
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
})

export default connect(null, mapDispatchToProps)(EditOption)
