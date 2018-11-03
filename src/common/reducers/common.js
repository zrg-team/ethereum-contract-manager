import { handleActions } from 'redux-actions'
import * as actions from '../actions/common'

const defaultState = {
  language: 'en',
  timeout: 30000
}

const handlers = {
  [actions.setUserLanguage]: (state, action) => {
    return {
      ...state,
      language: action.payload
    }
  },
  [actions.setRequestTimeout]: (state, action) => {
    return {
      ...state,
      timeout: action.payload
    }
  }
}

export default handleActions(handlers, defaultState)
