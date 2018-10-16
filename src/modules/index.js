// MODULE NAMES
import { MODULE_NAME as MODULE_DASHBOARD } from './dashboard/model'
import { MODULE_NAME as MODULE_PROJECT } from './project/model'
// MODULE REDUCERS
import dashboardReducers from './dashboard/reducers'
import projectReducers from './project/reducers'
// MODULE SAGAS
import dashboardSagas from './dashboard/sagas'

export const MODULE_SAGAS = [
  ...dashboardSagas
]

export const MODULE_REDUCERS = {
  [MODULE_DASHBOARD]: dashboardReducers,
  [MODULE_PROJECT]: projectReducers
}
