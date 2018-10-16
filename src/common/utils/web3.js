import Web3 from 'web3'

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

export default {
  instance: null,
  injected: false,
  init: async function (url = undefined, useWeb3 = false) {
    const { web3, injected } = await getWeb3(url, useWeb3)
    this.instance = web3
    this.injected = injected
  }
}
