// SELECT RUNTIME FOR START CODING
// TODO: Your code here
async function main () {
  // TODO: Coding
  await describe('Test payout contract', () => {
    it('is Allow Withdraw', async () => {
      const isAllow = await view({
        inputs: [],
        contract: Payout,
        functionName: 'isAllowed'
      })
      expect(isAllow[0].value).to.equal(false)
    })
  })
  console.native($result)
}
main()