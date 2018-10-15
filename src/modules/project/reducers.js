import { handleActions } from 'redux-actions'
import * as actions from './actions'

const defaultState = {
  projects: []
}

const handlers = {
  [actions.addProject]: (state, action) => ({
    ...state,
    projects: [
      ...state.projects,
      action.payload
    ]
  }),
  [actions.removeProject]: (state, action) => {
    const projects = state.projects
      .filter(item => item.id !== action.payload)
    return {
      ...state,
      projects: [
        ...projects
      ]
    }
  }
}

export default handleActions(handlers, defaultState)
