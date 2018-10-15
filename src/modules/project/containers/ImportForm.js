import { connect } from 'react-redux'
import ImportForm from '../components/ImportForm'
import { store } from '../../../common/utils/database'
import { descrypt } from '../../../common/utils/encrypt'
import { loading } from '../../../common/middlewares/effects'
import { addProject } from '../actions'
import { setCurrentProject } from '../../dashboard/actions'

const mapDispatchToProps = (dispatch, props) => ({
  importProject: async (data, password) => {
    try {
      const result = await loading(async () => {
        data = JSON.stringify(data)
        let decypted = ''
        if (password) {
          decypted = descrypt(data.encypted, password)
        }
        decypted = JSON.parse(decypted)
        const defaultData = {
          name: data.name,
          description: data.description
        }
        const result = await store.setItem('project', {
          ...defaultData,
          ...decypted
        })
        console.log('result', result)
        dispatch(addProject(defaultData))
        dispatch(setCurrentProject({
          ...defaultData,
          ...decypted
        }))
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
