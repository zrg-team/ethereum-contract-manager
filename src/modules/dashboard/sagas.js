
import { takeLatest, put } from 'redux-saga/effects'
import {
  setConnectStatus,
  setCurrentProject
} from './actions'
import web3 from '../../common/utils/web3'

function * onProjectChange ({ payload }) {
  yield web3.init(payload.general.fullnode)
  yield put(setConnectStatus(true))
}

function * watchProjectChange () {
  yield takeLatest(setCurrentProject.toString(), onProjectChange)
}

export default [
  watchProjectChange()
]
