
import { takeLatest, put, select } from 'redux-saga/effects'
import { MODULE_NAME as MODULE_DASHBOARD } from '../dashboard/model'
import {
  fullnodeProcess,
  startEventWatch,
  stopFullnodeProcess,
  stopEventWatch
} from '../playground/actions'
import web3 from '../../common/utils/web3'

function * onFullnodeRequest ({ payload }) {
  try {
    const { currentProject } = yield select(state => state[MODULE_DASHBOARD])
    if (!currentProject || !currentProject.general || !currentProject.general.fullnode) {
      return false
    }
    yield web3.init(currentProject.general.fullnode)
    yield put(startEventWatch())
    web3.syncListener(function * (error, sync) {
      if (!error) {
        // stop all app activity
        if (sync === true) {
          // we use `true`, so it stops all filters, but not the web3.eth.syncing polling
          yield web3.instance.reset(true)
          // show sync info
        } else if (sync) {
          // re-gain app operation
        } else {
          // run your app init function...
          yield put(startEventWatch())
        }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

function * onStopFullnodeRequest () {
  yield put(stopEventWatch())
}

function * watchFullnodeRequest () {
  yield takeLatest(fullnodeProcess.toString(), onFullnodeRequest)
}
function * watchStopFullnodeRequest () {
  yield takeLatest(stopFullnodeProcess.toString(), onStopFullnodeRequest)
}

export default [
  watchFullnodeRequest(),
  watchStopFullnodeRequest()
]
