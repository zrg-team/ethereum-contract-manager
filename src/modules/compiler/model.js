export const MODULE_NAME = 'compiler'

export const DEFAULT_LOGO = `

──────────────────────────────▓▓█───────
────────────────────────────▒██▒▒█──────
───────────────────────────█▓▓▓░▒▓▓─────
─────────────────────────▒█▓▒█░▒▒▒█─────
────────────────────────▒█▒▒▒█▒▒▒▒▓▒────
─▓▓▒░──────────────────▓█▒▒▒▓██▓▒░▒█────
─█▓▓██▓░──────────────▓█▒▒▒▒████▒▒▒█────
─▓█▓▒▒▓██▓░──────────▒█▒▒▒▒▒██▓█▓░░▓▒───
─▓▒▓▒▒▒▒▒▓█▓░──░▒▒▓▓██▒▒▒▒▒▒█████▒▒▒▓───
─▓░█▒▒▒▒▒▒▒▓▓█▓█▓▓▓▓▒▒▒▒▒▒▒▒██▓██▒░▒█───
─▓░▓█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓████▒▒▒█───
─▓░▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒▒▒▒▓██░░░█───
─▓░▓███▒▒▒▒▒▒▒▒▒▒▒▓█▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▒▓▓──
─▒▒▒██▓▒▓█▓▒▒▒▒▒▒▒▓▒▒▒▒▒▒▓▓▓▒▒▒▒▒▒▒▓▒█──
──▓▒█▓▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▓█▓▓▓▓█▓▒▒▒▒▒▒▒▓▒─
──▓▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓──────▓█▓▒▒▒▒▒▓█─
──▒▒▓▒▒▒▓▓▓▒▒▒▒▒▒▒▒▒▓▓───░▓▓───█▓▒▒▒▒▒█─
───█▒▒▓▓▓▒▒▓▓▒▒▒▒▒▒▓▓───█████▓──█▓▒▒▒▒▓▒
───▓▓█▒─────▒▓▒▒▒▒▒█───░██████──░█▒▒▒▒▓▓
───▓█▒──▒███─▒▓▒▒▒▒█────██████───▓▒▒▒▒▒▓
───██───█████─█▒▒▒▒█─────███▓────▓▓▒▒▒▒▓
───█▓───█████─▒▓▒▒▒█─────────────█▓▓▓▒▒▓
───█▓───░███──░▓▒▒▒▓█──────────░█▓▒▒▒▓▒▓
───██─────────▒▓▒▒▒▒▓▓──────░▒▓█▓────░▓▓
───▓█░────────█▓██▓▒▒▓█▓▓▓▓██▓▓▒▓▒░░▒▓▒▓
───▒██░──────▓▒███▓▒▒▒▒▓▓▓▓▒▒▒▒▒▒▓▓▓▓▒▓─
────█▓█▓▓▒▒▓█▓▒░██▒▒▓▓█▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓█▒
────▓─░▓▓▓▓▓▒▓▓▓▓▒▓▓▓▒▓▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓
────▒▒▒▓▒▒▒▒▒▒▓█░─░░░─▓▓▒▒▒▒▒▒▒▒▒▒▒▓██▓▒
─────█▓▒▒▒▒▒▒▒▒▓▓─░░░─▓▓▒▒▒▒▒▒▒▒▒▓▓▓▒▒▓▒
──────██▓▓▒▒▒▒▒▒█▒░░░░█▒▒▒▒▒▒▒▒▓█▓▓▒▒▒▒▒
─────░─▒██▓▓▒▒▒▒▒█▓▒▒▓▒▒▒▒▒▒▓███▓▒▒▒▒▒▓▓
──────────░▒▓▓▓▓▒▒▓▓▓▓▓▓████▓▓█▒▒▒▒▒▓▓█░
        
`
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
  title: 'Blockchain API',
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
}, {
  title: 'Testing API',
  value: 'test-api',
  key: 'test-api',
  children: [
    {
      title: 'Overview',
      value: 'test-overview',
      key: 'test-overview'
    }, {
      title: 'Assert',
      value: 'test-assert',
      key: 'test-assert'
    }, {
      title: 'Expect',
      value: 'test-expect',
      key: 'test-expect'
    }
  ]
}]

export const DEFAULT_HELP_DATA = {
  'basic': `
## Javascript basic documents
  * Overview: About compiler
  * Data Types: Supported data types
  * Functions: Global functions
## Blockchain API documents
  * How to view contract data ?
  * How to excuse contract function ?
## Testing API documents
  * How to write unit test on deployed contract ?
  * Assert and Expect api

** Noted :** All injected function have "$" at prefix
Example: $accounts, $view, $submit, $project, etc
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
console.log(FreeToken.abi) // return '[...]'
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
    $project,
    {
      inputs: [$accounts.user2.address, +units.convert(1, 'eth', 'wei')],
      contract: FreeToken,
      functionName: 'transfer',
      valueSend: 0
    }
  )
  // Manual transaction
  const nonce = await $accounts.user2.getNonceAddress($factory.project)
  const functionTransfer = FreeToken.functions.find(item => item.name === 'transfer')
  const raw = $accounts.user2.createRawTransaction({
    to: $accounts.user1.address,
    from: $accounts.user2.address,
    value: 0x0,
    nonce,
    gasLimit: 8000000,
    gasPrice: 20 * 1000000000,
    functionName: 'transfer',
    privateKey: $accounts.user2.privateKey,
    typeParams: functionTransfer.inputs.map(item => item.type),
    functionParams: [$accounts.user1.address, +units.convert(1, 'eth', 'wei')]
  })
  $accounts.user2.submitTransaction($factory.project, raw)
}
\`\`\`
`,
  'api-functions': `
## Global Functions:
  * $view: get data from contract
  * $submit: submit transaction

### Example:
\`\`\`javascript
async function main () {
  try {
    const isAllow = await $view({
      inputs: [],
      contract: Payout,
      functionName: 'isAllowed'
    })
    let result = null
    if (isAllow[0] && !isAllow[0].value) {
      result = await $submit({
        inputs: [],
        account: accounts.ESCROW,
        contract: Payout,
        functionName: 'allowPayout'
      })
    } else {
      result = await $submit({
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
`,
  'test-overview': `
  We supported a simple test framework running on compiler, making asynchronous testing simple and fun.
  It tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test case

### EXAMPLE:
\`\`\`javascript
describe('Test Math Function', () => {
  it('Add work fine', async () => {
    const value = 2 + 2
    expect(value).to.equal(4)
  })
})
// OR
suite('Test Math Function', () => {
  test('Array Contain', async () => {
    const shoppingList = [
      'diapers',
      'kleenex',
      'trash bags',
      'paper towels',
      'beer',
    ]
    expect(shoppingList).toContain('beer')
  })
})
\`\`\`

## ASYNCHRONOUS CODE
Testing asynchronous code could not be simpler! Simply invoke the callback when your test is complete.
By adding a callback (usually named done) to it(), It will know that it should wait for this function to be called to complete the test.
This callback accepts both an Error instance (or subclass thereof) or a falsy value; anything else will cause a failed test.

\`\`\`javascript
describe('Test payout contract', () => {
  it('is Allow Withdraw', async () => {
    const isAllow = await view({
      inputs: [],
      contract: Payout,
      functionName: 'isAllowed'
    })
    expect(isAllow[0].value).to.equal(false)
  })
})
\`\`\`
`,
  'test-assert': `
  The assert style is exposed through assert interface. This provides the classic assert-dot notation, similar to that packaged with node.js.
  This assert module, however, provides several additional tests and is browser compatible
  In all cases, the assert style allows you to include an optional message as the last parameter in the assert statement.
  These will be included in the error messages should your assertion not pass.

\`\`\`javascript
var assert = require('chai').assert
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

assert.typeOf(foo, 'string'); // without optional message
assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
assert.equal(foo, 'bar', 'foo equal "bar"');
assert.lengthOf(foo, 3, 'foo's value has a length of 3');
assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
\`\`\`

* [More Information][information]
[information]: https://www.chaijs.com/api/assert/
`,
  'test-expect': `
  The BDD style is exposed through expect or should interfaces. In both scenarios, you chain together natural language assertions.
\`\`\`javascript
var expect = require('chai').expect
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

expect(foo).to.be.a('string');
expect(foo).to.equal('bar');
expect(foo).to.have.lengthOf(3);
expect(beverages).to.have.property('tea').with.lengthOf(3);
\`\`\`
  Expect also allows you to include arbitrary messages to prepend to any failed assertions that might occur.
  This comes in handy when being used with non-descript topics such as booleans or numbers.

  * [More Information][information]
[information]: https://www.chaijs.com/api/bdd/
`
}
