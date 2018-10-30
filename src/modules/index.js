// MODULE NAMES
import { MODULE_NAME as MODULE_DASHBOARD } from './dashboard/model'
import { MODULE_NAME as MODULE_PROJECT } from './project/model'
// MODULE REDUCERS
import dashboardReducers from './dashboard/reducers'
import projectReducers from './project/reducers'
// MODULE SAGAS
import playgroundSagas from './playground/saga'
import dashboardSagas from './dashboard/saga'

export const MODULE_SAGAS = [
  ...playgroundSagas,
  ...dashboardSagas
]

export const MODULE_REDUCERS = {
  [MODULE_DASHBOARD]: dashboardReducers,
  [MODULE_PROJECT]: projectReducers
}
