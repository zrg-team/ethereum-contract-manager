async function main () {
  const result = await contracts.Lotto.view(
      factory.project,
      'drawInfo',
      [1]
  )
  console.table(result)
}
main()
