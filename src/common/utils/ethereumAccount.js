const Bip39 = require('bip39')
const HDKey = require('ethereumjs-wallet/hdkey')
const Wallet = require('ethereumjs-wallet')
const Util = require('ethereumjs-util')

export default {
  fromPrivateKey: (hexPK) => {
    const key = Buffer.from(hexPK, 'hex')
    return Wallet.fromPrivateKey(key)
  },
  /**
   * Restore wallet from seed
   * @param {string} passphrase
   * @param {string} path
   * @param {integer} child
   * @return {object} Wallet object
   */
  restoreWalletFromSeed: (passphrase, path, child) => {
    const masterSeed = Bip39.mnemonicToSeed(passphrase)
    return HDKey
      .fromMasterSeed(masterSeed)
      .derivePath(path || "m/44'/60'/0'/0")
      .deriveChild(child || 0)
      .getWallet()
  },

  /**
   * Create wallet from seed
   * @return {object} Wallet object
   */
  createWalletFromSeed: () => {
    const mnemonic = this.generateMnemonic()
    const masterSeed = Bip39.mnemonicToSeed(mnemonic)
    const wallet = HDKey
      .fromMasterSeed(masterSeed)
      .derivePath("m/44'/60'/0'/0")
      .deriveChild(0)
      .getWallet()
    return {
      mnemonic,
      wallet
    }
  },

  /**
   * Generate passphrase
   * @return {string} 12 words passphrase
   */
  generateMnemonic: () => {
    return Bip39.generateMnemonic()
  },

  /**
   * Validate seed
   * @param passphrase {string}
   * @return {boolean}
   */
  validateSeed: (passphrase) => {
    return Bip39.validateMnemonic(passphrase)
  },

  /**
   * Validate & convert privateKey to address
   * @param {Buffer} privateKey
   * @param {string}
   */
  privateToAddress: (privateKey) => {
    if (Util.isValidPrivate(Buffer.from(privateKey, 'hex'), false)) {
      return '0x' + Util.privateToAddress(Buffer.from(privateKey, 'hex')).toString('hex')
    }
    return ''
  },

  /**
   * Validate ethereum address
   * @param {string} address
   * @param {boolean}
   */
  validateAddress: (address) => {
    return Util.isValidAddress(address.toLowerCase())
  },

  /**
   * Open V3 wallet
   * @param {string} strJson Input v3 mist wallet key file
   * @param {string} password Password
   * @return {object} Wallet object
   */
  fromKeystore: (strJson, password) => {
    return Wallet.fromV3(strJson, password)
  },

  /**
   * Export to V3 wallet
   * @param {string} password
   * @return {string}
   */
  exportKeystore: (strJson, password) => {
    return Wallet
      .fromV3(strJson, password)
      .toV3String(password)
  }
}
