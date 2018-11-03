import units from 'ethereumjs-units'
import { BigNumber } from 'bignumber.js'

export function format (value, decimalCount = 2, decimal = '.', thousands = ',') {
  try {
    decimalCount = Math.abs(decimalCount)
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount

    const negativeSign = value < 0 ? '-' : ''

    let i = parseInt(value = Math.abs(Number(value) || 0).toFixed(decimalCount)).toString()
    let j = (i.length > 3) ? i.length % 3 : 0

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(value - i).toFixed(decimalCount).slice(2) : '')
  } catch (e) {
    console.log(e)
    return 0
  }
}

export function formatCrypto (value, digits = 6) {
  return Number(value).toLocaleString('en', {
    maximumFractionDigits: digits
  })
}

export function fromWei (value, to = 'eth') {
  const result = new BigNumber(`${units.convert(`${value}`, 'wei', to)}`)
  console.log(result.toFixed())
  return result.toFixed()
}
