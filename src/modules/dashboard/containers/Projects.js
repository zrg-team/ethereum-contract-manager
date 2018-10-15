import { connect } from 'react-redux'
import Projects from '../components/Projects'
import { MODULE_NAME as MODULE_PROJECT } from '../../project/model'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => {
  return {
    projects: state[MODULE_PROJECT].projects
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects)
