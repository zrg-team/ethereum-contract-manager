
import { takeLatest, put, select, call, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { MODULE_NAME as MODULE_DASHBOARD } from '../dashboard/model'
import { MODULE_NAME as MODULE_PROJECT } from '../project/model'
import {
  startEventWatch,
  stopEventWatch
} from './actions'
import {
  setTransactions
} from '../project/actions'
import {
  setCurrentProject
} from '../dashboard/actions'
import web3 from '../../common/utils/web3'

let watchers = []
// let blockInstance = null
const CONTRACT_EVENT = 'CONTRACT_EVENT'

function eventHandler (currentProject) {
  return eventChannel(emitter => {
    const blockNumber = web3.getCurrentBlock()
    // blockInstance = web3.newBlockListener((data) => {
    //   emitter({ type: CONTRACT_EVENT, data })
    // }, currentProject.contracts.map(item => item.address), blockNumber)
    currentProject.contracts.forEach(contract => {
      watchers.push(web3.contractListener(contract.address, (error, result) => {
        if (!error) {
          emitter({ type: CONTRACT_EVENT, result, contract, key: contract.address })
        }
      }, blockNumber))
    })
    return () => {
      watchers.forEach((item) => {
        item.stopWatching()
      })
      watchers = []
      // blockInstance.stopWatching()
      // blockInstance = null
    }
  })
}
function * onStopEventRequest () {
  watchers.forEach((item) => {
    item.stopWatching()
  })
  watchers = []
  web3.stopProcess()
  yield put(setCurrentProject(null))
}
function * onEventListenerRequest () {
  try {
    const { currentProject } = yield select(state => state[MODULE_DASHBOARD])
    yield web3.connectToContracts(currentProject.contracts)
    const channel = yield call(eventHandler, currentProject)
    while (true) {
      const { type, result, contract } = yield take(channel)
      let { transactions } = yield select(state => state[MODULE_PROJECT])
      switch (type) {
        case CONTRACT_EVENT:
          let filteredTransactions = (transactions[currentProject.key] || []).map(item => {
            if (item.transactionId === result.transactionHash) {
              if (!item.response) {
                item.response = []
              }
              item.response.push({
                blockNumber: result.blockNumber,
                event: result.event,
                transactionHash: result.transactionHash,
                transactionIndex: result.transactionIndex,
                blockHash: result.blockHash,
                args: result.args
              })
            }
            return item
          })
          yield put(setTransactions({
            key: currentProject.key,
            data: filteredTransactions
          }))
          break
        default:
          break
      }
    }
  } catch (error) {
    console.error(error)
  }
}

function * watchStartEvent () {
  yield takeLatest(startEventWatch.toString(), onEventListenerRequest)
}

function * watchStopEvent () {
  yield takeLatest(stopEventWatch.toString(), onStopEventRequest)
}

export default [
  watchStartEvent(),
  watchStopEvent()
]
