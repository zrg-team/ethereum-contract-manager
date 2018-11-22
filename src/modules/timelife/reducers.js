import { handleActions } from 'redux-actions'
import * as actions from './actions'

const defaultState = {
  outputs: []
}

const handlers = {
  [actions.setOutput]: (state, action) => ({
    ...state,
    outputs: action.payload
  }),
  [actions.appendOutput]: (state, action) => ({
    ...state,
    outputs: [
      ...state.outputs,
      action.payload
    ]
  })
}

export default handleActions(handlers, defaultState)
