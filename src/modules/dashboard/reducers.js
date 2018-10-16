import { handleActions } from 'redux-actions'
import * as actions from './actions'

const defaultState = {
  currentProject: null,
  connected: false
}

const handlers = {
  [actions.setCurrentProject]: (state, action) => {
    return {
      ...state,
      connected: false,
      currentProject: action.payload
    }
  },
  [actions.setConnectStatus]: (state, action) => {
    return {
      ...state,
      connected: action.payload
    }
  }
}

export default handleActions(handlers, defaultState)
