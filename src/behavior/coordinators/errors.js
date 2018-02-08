
export const HandleError = ({ UIService }) => ({ error, namespace }) => {
  if ( error.response && error.response.data ) {
    Object.entries(error.response.data).forEach( e => {
      UIService.FlashMessage.displayFailureMessage( e[0] + ': ' + e[1] )
    })
  }
  else {
    UIService.FlashMessage.displayFailureMessage( 'Error!' )
  }
}