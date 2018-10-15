import { handleActions } from 'redux-actions'
import * as actions from './actions'

const defaultState = {
  currentProject: null
}

const handlers = {
  [actions.setCurrentProject]: (state, action) => {
    return {
      ...state,
      currentProject: action.payload
    }
  }
}

export default handleActions(handlers, defaultState)
