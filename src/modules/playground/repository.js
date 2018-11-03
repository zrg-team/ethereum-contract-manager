import { fetchLoading } from '../../common/middlewares/effects'
import { getDataSmartContract } from '../../common/utils/ethereum'
import storeAccessible from '../../common/utils/storeAccessible'

function parseRequestConfig (mode, project, data) {
  const common = storeAccessible.getModuleState('common')

  const method = project.general[mode].method || 'GET'
  const headers = project.general[mode].headers || []
  const params = project.general[mode].params || []
  const headerValues = project.general[mode].headerValues || {}
  const paramValues = project.general[mode].paramValues || {}
  const timeout = project.general[mode].method.timeout || common.timeout
  return {
    method,
    timeout,
    headers: headers.reduce((all, item) => {
      return { ...all, [`${item}`.replace('header_', '')]: headerValues[item] }
    }, {}),
    params: method === 'get'
        ? params.reduce((all, item, index) => {
          let value = paramValues[item]
          if (data[index]) {
            value = data[index]
          }
          return { ...all, [`${item}`.replace('param_', '')]: value }
        }, {})
      : {},
    data: method === 'get'
      ? {}
      : params.reduce((all, item, index) => {
        let value = paramValues[item]
        if (data[index]) {
          value = data[index]
        }
        return { ...all, [`${item}`.replace('param_', '')]: value }
      }, {})
  }
}

function parseRequestResponse (mode, project, response) {
  const resultPath = project.general[mode].response || ''
  if (!resultPath) {
    return response.data
  }
  const paths = `${resultPath}`.split('.')
  let value = response.data
  paths.forEach(key => {
    value = value[key]
  })
  if (!value) {
    throw new Error('INVALID_RETURN')
  }
  return value
}

export function getContractView (project, data) {
  const raw = getDataSmartContract({
    functionName: data.name,
    typeParams: data.inputs || [],
    params: data.params || []
  })
  const url = `${project.general.callTransactionUrl}`
  return fetchLoading({
    url,
    options: {
      ...parseRequestConfig('ethCallRequest', project, [data.address, `0x${raw}`])
    }
  })
  .then(response => {
    return parseRequestResponse('ethCallRequest', project, response)
  })
}

export function submitFunctionTransaction (project, hex) {
  const url = `${project.general.transactionUrl}`
  return fetchLoading({
    url,
    options: {
      ...parseRequestConfig('transactionRequest', project, [hex])
    }
  })
  .then(response => {
    return parseRequestResponse('transactionRequest', project, response)
  })
}

export function getNonce (project, address) {
  const url = `${project.general.nonceTransactionUrl}`
  return fetchLoading({
    url,
    options: {
      ...parseRequestConfig('nonceRequest', project, [address])
    }
  })
  .then(response => {
    return parseRequestResponse('nonceRequest', project, response)
  })
}

export function getTransactionReceipt (project, txhash) {
  const url = `${project.general.checkTransactionUrl}`
  return fetchLoading({
    url,
    options: {
      ...parseRequestConfig('receiptRequest', project, [`${txhash}`])
    }
  })
  .then(response => {
    return parseRequestResponse('receiptRequest', project, response)
  })
}
