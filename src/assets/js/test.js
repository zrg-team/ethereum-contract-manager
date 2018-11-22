function sync (data, time = 1000) {
  console.log('step 2')
  return new Promise((resolve) => {
    console.log('step 3', time)
    setTimeout(() => {
      console.log('step 4')
      resolve(data)
    }, time)
  })
}
async function main () {
  console.log('step 1')
  const result = await sync('hello')
  console.log(result)
  console.native(result)
  $complete()
}
console.native('start')
main()
