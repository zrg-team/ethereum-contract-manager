import { createAction } from 'redux-actions'
import { MODULE_NAME } from './model'

export const setCurrentProject = createAction(`${MODULE_NAME}_SET_CURRENT_PROJECT`)
