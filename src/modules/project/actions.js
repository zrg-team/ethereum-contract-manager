import { createAction } from 'redux-actions'
import { MODULE_NAME } from './model'

export const addProject = createAction(`${MODULE_NAME}_ADD_PROJECT`)
export const removeProject = createAction(`${MODULE_NAME}_REMOVE_PROJECT`)
export const addTransaction = createAction(`${MODULE_NAME}_ADD_TRANSACTION`)
export const setTransactions = createAction(`${MODULE_NAME}_SET_TRANSACTIONS`)
