// SELECT RUNTIME FOR START CODING
async function main () {
  // TODO: Coding
  try {
    const isAllow = await view({
      inputs: [],
      contract: Payout,
      functionName: 'isAllowed'
    })
    let result = null
    console.log(isAllow[0].value)
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
