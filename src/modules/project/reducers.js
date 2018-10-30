import { handleActions } from 'redux-actions'
import * as actions from './actions'

const defaultState = {
  projects: [],
  transactions: {}
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
      .filter(item => item.key !== action.payload)
    return {
      ...state,
      projects: [
        ...projects
      ]
    }
  },
  [actions.addTransaction]: (state, action) => ({
    ...state,
    transactions: {
      ...state.transactions,
      [action.payload.key]: [
        ...action.payload.data ? action.payload.data : [],
        ...state.transactions[action.payload.key] ? state.transactions[action.payload.key] : []
      ]
    }
  }),
  [actions.setTransactions]: (state, action) => ({
    ...state,
    transactions: {
      ...state.transactions,
      [action.payload.key]: action.payload.data
    }
  })
}

export default handleActions(handlers, defaultState)
