const SHA512 = require('crypto-js/sha512')
const CryptoJS = require('crypto-js')

export const encrypt = (string, password) => {
  return CryptoJS.AES.encrypt(string, SHA512(password).toString()).toString()
}
export const descrypt = (string, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(string, SHA512(password).toString())
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (e) {
    return ''
  }
}
