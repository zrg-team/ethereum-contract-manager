import { createAction } from 'redux-actions'
import { MODULE_NAME } from './model'

export const setCurrentProject = createAction(`${MODULE_NAME}_SET_CURRENT_PROJECT`)
export const setConnectStatus = createAction(`${MODULE_NAME}_SET_WEB3_STATUS`)
