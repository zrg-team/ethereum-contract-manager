import { all } from 'redux-saga/effects'
import commonSagas from './sagas'
import { MODULE_SAGAS } from '../../modules/index'
export default getState => {
  function * rootSaga () {
    yield all([
      ...commonSagas,
      ...MODULE_SAGAS
    ])
  }
  return rootSaga
}
