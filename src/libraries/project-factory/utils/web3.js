import Web3 from 'web3'

let contracts = {}
export let instance = null
let blockListenInstance = null
const resolveWeb3 = (resolve, url, useWeb3) => {
  let { web3 } = window
  let injected = false
  const alreadyInjected = typeof web3 !== 'undefined' // i.e. Mist/Metamask
  const localProvider = url || `https://ropsten.infura.io/NORoo6q08PHrWmd5Mfzy`

  if (useWeb3 && alreadyInjected) {
    console.log(`Injected web3 detected.`)
    web3 = new Web3(web3.currentProvider)
    injected = true
  } else {
    console.log(`No web3 instance injected, using Local web3.`, localProvider)
    const provider = new Web3.providers.HttpProvider(localProvider)
    web3 = new Web3(provider)
  }

  resolve({ web3, injected })
}

const getWeb3 = (url, useWeb3) =>
  new Promise((resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolveWeb3(resolve, url, useWeb3)
    })
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === `complete`) {
      resolveWeb3(resolve, url, useWeb3)
    }
  })

const getContractConnect = (abi, address) => {
  const contract = instance.eth.contract(abi)
  return contract.at(address)
}

const connectToContracts = (list) => {
  contracts = list.reduce((all, item) => {
    const contract = getContractConnect(JSON.parse(item.abi), item.address)
    return { ...all, [item.address]: contract }
  }, {})
}

const getNonceUsingFullnode = async (address) => {
  try {
    const count = await instance.eth.getTransactionCount(address)
    return count
  } catch (err) {
    return undefined
  }
}

const sendRawTransactionUsingFullnode = async (raw) => {
  try {
    const transaction = await instance.eth.sendSignedTransaction(raw)
    return transaction
  } catch (err) {
    return undefined
  }
}

const contractListener = (address, callback, fromBlock = 0) => {
  const events = contracts[address].allEvents({ fromBlock, toBlock: 'latest' })
  events.watch((error, result) => {
    callback(error, result)
  })
  return events
}

const getCurrentBlock = () => {
  const block = instance.eth.blockNumber
  return block
}

const newBlockListener = (functionCallback, address, fromBlock = 0) => {
  if (blockListenInstance) {
    blockListenInstance.stopWatching()
    blockListenInstance = null
  }
  blockListenInstance = instance.eth.filter({
    fromBlock,
    toBlock: 'latest',
    address: address
  })
  blockListenInstance.watch(function (error, result) {
    functionCallback({ error, result, address })
  })
  return blockListenInstance
}

const syncListener = (callback) => {
  instance.eth.isSyncing(function (error, sync) {
    callback(error, sync)
  })
}

const stopProcess = () => {
  instance && instance.reset()
  instance = null
}

const getBalance = (address) => {
  return instance.eth.getBalance(address)
}

export default {
  Web3,
  contracts,
  injected: false,
  init: async function (url = undefined, useWeb3 = false) {
    const { web3, injected } = await getWeb3(url, useWeb3)
    instance = web3
    this.injected = injected
  },
  getBalance,
  stopProcess,
  syncListener,
  getCurrentBlock,
  contractListener,
  newBlockListener,
  connectToContracts,
  getNonceUsingFullnode,
  sendRawTransactionUsingFullnode
}
