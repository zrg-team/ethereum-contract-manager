import axios from 'axios'
import { getDataSmartContract } from './ethereum'

function parseRequestConfig (mode, project, data) {
  const method = project.general[mode].method || 'GET'
  const headers = project.general[mode].headers || []
  const params = project.general[mode].params || []
  const headerValues = project.general[mode].headerValues || {}
  const paramValues = project.general[mode].paramValues || {}
  const timeout = project.general[mode].method.timeout || 60000
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
    throw new Error('INVALID_RETURN_PATH')
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
  return axios({
    url,
    ...parseRequestConfig('ethCallRequest', project, [data.address, `0x${raw}`])
  })
  .then(response => {
    return parseRequestResponse('ethCallRequest', project, response)
  })
}

export function submitFunctionTransaction (project, hex) {
  const url = `${project.general.transactionUrl}`
  return axios({
    url,
    ...parseRequestConfig('transactionRequest', project, [hex])
  })
  .then(response => {
    return parseRequestResponse('transactionRequest', project, response)
  })
}

export function getNonce (project, address) {
  const url = `${project.general.nonceTransactionUrl}`
  return axios({
    url,
    ...parseRequestConfig('nonceRequest', project, [address])
  })
  .then(response => {
    return parseRequestResponse('nonceRequest', project, response)
  })
}

export function getTransactionReceipt (project, txhash) {
  const url = `${project.general.checkTransactionUrl}`
  return axios({
    url,
    ...parseRequestConfig('receiptRequest', project, [`${txhash}`])
  })
  .then(response => {
    return parseRequestResponse('receiptRequest', project, response)
  }).catch(err => {
    return { error: true, message: err.message }
  })
}
