import { all } from 'redux-saga/effects'
import commonSagas from './sagas'
import { MODULE_SAGAS } from '../../modules/index'
console.log('commonSagas', MODULE_SAGAS)
export default getState => {
  function * rootSaga () {
    yield all([
      ...commonSagas,
      ...MODULE_SAGAS
    ])
  }
  return rootSaga
}
