async function main () {
  const result = await view(
      Lotto,
      'drawInfo',
      [1]
  )
  console.table(result)
}
main()
