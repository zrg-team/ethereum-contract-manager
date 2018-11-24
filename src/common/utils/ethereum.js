import Web3 from 'web3'
import web3 from './web3'
const Transaction = require('ethereumjs-tx')
const Abi = require('ethereumjs-abi')

const web3Utils = new Web3()
export function getDataSmartContract ({ functionName, typeParams, params }) {
  return Abi
    .methodID(functionName, typeParams)
    .toString('hex') + Abi.rawEncode(typeParams, params)
    .toString('hex')
}

export function getAccount () {
  return new Promise((resolve, reject) => {
    web3.instance.eth.getAccounts(function (err, accounts) {
      if (err != null) {
        resolve({ error: true })
      } else if (accounts.length === 0) {
        resolve({ error: false, message: 'Please login your MetaMask !' })
      } else {
        resolve({ error: false, address: web3.instance.eth.accounts[0] })
      }
    })
  })
}

export function sendTransaction (defaultAccount, data) {
  if (!web3 || !web3.instance || !web3.injected || !defaultAccount) {
    const url = `https://www.myetherwallet.com/?to=${data.to}&value=${web3.instance.toWei(data.value, 'ether')}&gasLimit=300000&#send-transaction`
    window.open(url, '_blank')
    return false
  }
  return new Promise((resolve, reject) => {
    web3.instance.eth.sendTransaction({
      to: data.to,
      from: defaultAccount,
      value: web3.instance.toWei(data.value, 'ether')
    }, function (err, transactionHash) {
      if (err) {
        reject(err)
      } else {
        resolve(transactionHash)
      }
    })
  })
}

export function getTransactionLink (txID) {
  // FIXME: all config for ropsten, rinkeby, or mainnet
  return `https://ropsten.etherscan.io/tx/${txID}`
}

export function convertEthereumOutput (value, type) {
  switch (type) {
    case 'uint':
    case 'uint8':
    case 'uint16':
    case 'uint32':
    case 'uint64':
    case 'uint128':
    case 'uint256':
      return web3Utils.toDecimal(value)
    case 'bool':
      return Number(value) === 1
    case 'address':
      return `${value}`.replace('0x000000000000000000000000', '0x')
    case 'bytes32':
      return web3Utils.toAscii(value)
    default:
      return value
  }
}

export function mapHexToOutput (response, outputs) {
  const length = response.length
  const count = outputs.length
  return outputs.reduceRight((all, item, index) => {
    const offset = length - (count - (index + 1)) * 64
    const data = `${response}`.slice(offset - 64, offset)
    all.push({
      ...item,
      raw: `0x${data}`,
      value: convertEthereumOutput(`0x${data}`, item.type)
    })
    return all
  }, [])
}

export function parseTransactionParams (item) {
  let type = ''
  let value = ''
  switch (item.type) {
    case 'bool':
      type = item.type
      value = item.value === 'true'
      break
    case 'uint256[]':
    case 'arrayUint256':
      type = 'uint256[]'
      value = [...`${item.value}`.split(',')]
      break
    case 'uint[]':
    case 'arrayUint':
      type = 'uint[]'
      value = [...`${item.value}`.split(',')]
      break
    case 'uint8[]':
    case 'arrayUint8':
      type = 'uint8[]'
      value = [...`${item.value}`.split(',')]
      break
    case 'uint16[]':
    case 'arrayUint16':
      type = 'uint16[]'
      value = [...`${item.value}`.split(',')]
      break
    case 'uint32[]':
    case 'arrayUint32':
      type = 'uint32[]'
      value = [...`${item.value}`.split(',')]
      break
    case 'uint64[]':
    case 'arrayUint64':
      type = 'uint64[]'
      value = [...`${item.value}`.split(',')]
      break
    case 'uint128[]':
    case 'arrayUint128':
      type = 'uint128[]'
      value = [...`${item.value}`.split(',')]
      break
    case 'address[]':
    case 'arrayAddress':
      type = 'address[]'
      value = [...`${item.value}`.split(',')]
      break
    case 'bytes32[]':
    case 'arrayByte32':
      type = 'bytes32[]'
      value = [...`${item.value}`.split(',')]
      break
    default:
      type = item.type
      value = `${item.value}`
      break
  }
  return {
    type,
    value
  }
}

export function createTransaction (params) {
  const transaction = new Transaction()
  transaction.to = params.to
  transaction.gasLimit = params.gasLimit
  transaction.gasPrice = params.gasPrice
  transaction.nonce = params.nonce
  transaction.value = params.value
  transaction.data = params.data !== undefined && params.data !== null
  ? params.data : `0x${getDataSmartContract({
    functionName: params.functionName,
    typeParams: params.typeParams,
    params: params.functionParams
  })}`
  const privateKey = new Buffer(params.privateKey.substring(2, params.privateKey.length), 'hex')

  transaction.sign(new Buffer(privateKey), 'hex')
  return '0x' + transaction.serialize().toString('hex')
}
