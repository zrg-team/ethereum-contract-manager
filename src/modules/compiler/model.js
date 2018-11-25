export const MODULE_NAME = 'compiler'

export const DEFAULT_HELP_TREE = [{
  title: 'Basic',
  value: 'basic',
  key: 'basic',
  children: [
    {
      title: 'Overview',
      value: 'basic-overview',
      key: 'basic-overview'
    }, {
      title: 'Data Types',
      value: 'basic-datatypes',
      key: 'basic-datatypes'
    }, {
      title: 'Functions',
      value: 'basic-functions',
      key: 'basic-functions'
    }
  ]
}, {
  title: 'Project API',
  value: 'api',
  key: 'api',
  children: [
    {
      title: 'Overview',
      value: 'api-overview',
      key: 'api-overview'
    }, {
      title: 'Contracts',
      value: 'api-contracts',
      key: 'api-contracts'
    }, {
      title: 'Accounts',
      value: 'api-accounts',
      key: 'api-accounts'
    }, {
      title: 'Functions',
      value: 'api-functions',
      key: 'api-functions'
    }
  ]
}]

export const DEFAULT_HELP_DATA = {
  'basic': `
## Javascript basic documents
  * Overview: About compiler
  * Data Types: Supported data types
  * Functions: Global functions
## Project API document
  * How to view contract data
  * How to excuse contract function
`,
  'basic-overview': `
  This sandbox compiler using **javascript** as primary language

  **JavaScript** is a interpreted, object oriented, high level scripting language.
  **JavaScript** contains a standard library of objects, such as Array, Date, and Math, and a core set of language elements such as operators, control structures, and statements.

  **Please noted**: this compiler is not support fully javascript, harmful function are removed, DOM object also removed

  [Read more][more]
[more]: https://www.w3schools.com/js/
`,
  'basic-datatypes': `
  ## Supported Data Types:
  * [String][string]
[string]: https://www.w3schools.com/js/js_string_methods.asp
  * [Object][object]
[object]: https://www.w3schools.com/js/js_objects.asp
  * [Array][array]
[array]: https://www.w3schools.com/js/js_arrays.asp
  * [Number][number]
[number]: https://www.w3schools.com/js/js_numbers.asp
  * [BigNumber][bignumber]
[bignumber]: http://mikemcl.github.io/bignumber.js/
  * [Symbol][symbol]
[symbol]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
  * [Date][date]
[date]: https://www.w3schools.com/js/js_dates.asp
  * [Error][error]
[error]: https://www.w3schools.com/js/js_errors.asp
  * [Promise][promise]
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
`,
  'basic-functions': `
  ## Supported Functions:
  * [JSON][json]
[json]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
  * [Math][math]
[math]: https://www.w3schools.com/js/js_math.asp
  * [RegExp][reg]
[reg]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
  * [units][unit] : convert ethereum unit library
[unit]: https://github.com/ethereumjs/ethereumjs-units
  * [moment][moment] : datetime library
[moment]: https://momentjs.com/
  * [fetch][axios] : fetch data library (axios)
[axios]: https://github.com/axios/axios
  * [clearInterval][clearI]
[clearI]: https://www.w3schools.com/jsref/met_win_clearinterval.asp
  * [setInterval][setI]
[setI]: https://www.w3schools.com/jsref/met_win_setinterval.asp
  * [setTimeout][setT]
[setT]: https://www.w3schools.com/jsref/met_win_settimeout.asp
  * [clearTimeout][clearT]
[clearT]: https://www.w3schools.com/jsref/met_win_cleartimeout.asp
  * console: including console.log, console.native, console.table
`,
  'api-overview': `
  This compiler also support some default function to interact with ethereum smart contracts and accounts.

  **To interact with smart contract or accounts you must choose a runtime**

  **What is a runtime ?**

  Runtime is a project which can created in "New Project" or "Import Project"

  We also support a example project file (powerred by Etherscan)
`,
  'api-contracts': `
## About:

  This part of API provices the instance of smart contract. Every contracts which added to your project file will have a global instance.

### Example:

\`\`\`javascript
// Project including Erc20 Token contract named "FreeToken"
console.log(FreeToken.address) // return '0x41...'
onsole.log(FreeToken.abi) // return '[...]'
\`\`\`

## Support functions:
  * getView: return all name of view method and variable of contract
  * getFunction: return all name of fucntion
  * view: return data of contract

### Example:
\`\`\`javascript
// Project including Erc20 Token contract named "FreeToken"
async function main () {
  const result = await FreeToken.view($factory.project,
    {
      inputs: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
      functionName: 'balanceOf'
    }
  )
  console.table(result)
}
main()
\`\`\`
`,
  'api-accounts': `
## About:

  Compiler also added "accounts" at global object which return list project's account

### Example:
\`\`\`javascript
  console.log(JSON.stringify(accounts)) // return {"user1": { "address": "0x42...
\`\`\`

## Support functions:
  * submit: submit transaction with account privateKey
  * createRawTransaction: create raw transaction
  * getNonceAddress: get nonce of this account
  * submitTransaction: submit raw transction

### Example:
\`\`\`javascript
// Project including Erc20 Token contract named "FreeToken"
async function main () {
  // Automatic transaction
  const result = await accounts.user1.submit(
    $factory.project,
    {
      inputs: [accounts.user2.address, +units.convert(1, 'eth', 'wei')],
      contract: FreeToken,
      functionName: 'transfer',
      valueSend: 0
    }
  )
  // Manual transaction
  const nonce = await accounts.user2.getNonceAddress($factory.project)
  const functionTransfer = FreeToken.functions.find(item => item.name === 'transfer')
  const raw = accounts.user2.createRawTransaction({
    to: accounts.user1.address,
    from: accounts.user2.address,
    value: 0x0,
    nonce,
    gasLimit: 8000000,
    gasPrice: 20 * 1000000000,
    functionName: 'transfer',
    privateKey: accounts.user2.privateKey,
    typeParams: functionTransfer.inputs.map(item => item.type),
    functionParams: [accounts.user1.address, +units.convert(1, 'eth', 'wei')]
  })
  accounts.user2.submitTransaction($factory.project, raw)
}
\`\`\`
`,
  'api-functions': `
## Global Functions:
  * view: get data from contract
  * submit: submit transaction

### Example:
\`\`\`javascript
async function main () {
  try {
    const isAllow = await view({
      inputs: [],
      contract: Payout,
      functionName: 'isAllowed'
    })
    let result = null
    if (isAllow[0] && !isAllow[0].value) {
      result = await submit({
        inputs: [],
        account: accounts.ESCROW,
        contract: Payout,
        functionName: 'allowPayout'
      })
    } else {
      result = await submit({
        inputs: [],
        account: accounts.ESCROW,
        contract: Payout,
        functionName: 'disallowPayout'
      })
    }
    console.native(result)
  } catch (err) {
    console.native(err)
  }
}
\`\`\`
`
}
