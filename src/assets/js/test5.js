describe('Test Payout Contract', () => {
  it('Allow Withdraw Function', async () => {
    const isAllow = await view({
      inputs: [],
      contract: Payout,
      functionName: 'isAllowed'
    })
    if (!isAllow[0].value) {
      const result = await submit({
        inputs: [],
        account: accounts.ESCROW,
        contract: Payout,
        functionName: 'allowPayout'
      })
      console.native(result)
      expect(result.logs.length).to.above(0)
      expect(result.logs[0].event.length).to.above(0)
      expect(result.logs[0].event[0].name)
        .to.equal('AllowPayout')
      return true
    }
    expect.fail('Contract is allow is true')
  })
  it('Disallow Withdraw Function', async () => {
    const isAllow = await view({
      inputs: [],
      contract: Payout,
      functionName: 'isAllowed'
    })
    if (isAllow[0].value) {
      const result = await submit({
        inputs: [],
        account: accounts.ESCROW,
        contract: Payout,
        functionName: 'disallowPayout'
      })
      console.native(result)
      expect(result.logs.length).to.above(0)
      expect(result.logs[0].event.length).to.above(0)
      expect(result.logs[0].event[0].name)
        .to.equal('DisallowPayout')
      return true
    }
    expect.fail('Contract is allow is false')
  })
})
