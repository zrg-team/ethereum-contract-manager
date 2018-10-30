import { createAction } from 'redux-actions'
import { MODULE_NAME } from './model'

export const startBlockWatch = createAction(`${MODULE_NAME}_START_BLOCK_WATCH`)
export const startEventWatch = createAction(`${MODULE_NAME}_START_EVENT_WATCH`)
export const fullnodeProcess = createAction(`${MODULE_NAME}_FULLNODE_PROCESS`)

export const stopEventWatch = createAction(`${MODULE_NAME}_STOP_EVENT_WATCH`)
export const stopFullnodeProcess = createAction(`${MODULE_NAME}_STOP_FULLNODE_PROCESS`)
