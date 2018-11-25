import { createAction } from 'redux-actions'
import { MODULE_NAME } from './model'

export const setOutput = createAction(`${MODULE_NAME}_SET_OUTPUT`)
export const appendOutput = createAction(`${MODULE_NAME}_APPEND_OUTPUT`)
export const setRuntime = createAction(`${MODULE_NAME}_SET_RUNTIME`)
