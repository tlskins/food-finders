export const RetryOnTimeout = ({ Request }) => async retries => {
  let successful = false
  let tries = 0
  while( !successful && tries < retries ) {
    try {
      tries += 1
      successful = true
      console.log( 'RetryOnTimeout - tries=', tries, 'successful=', successful )
      const response = await Request()
      console.log( 'RetryOnTimeout - response=', response )

      return response
    }
    catch( error ) {
      console.log( 'RetryOnTimeout - error=', error )
      successful = false
    }
  }
}
