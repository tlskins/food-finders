
export const HandleError = ({ UIService, pResponseError }) => ({ error, namespace, doFlash }) => {
  doFlash = doFlash === undefined ? true : doFlash
  const { errors, errorMessage } = pResponseError( error )
  namespace && UIService.Errors.updateErrors({ errors, namespace })

  if ( doFlash ) {
    if ( Array.isArray( errorMessage )) {
      errorMessage.forEach( message => {
        UIService.FlashMessage.displayFailureMessage( message )
      })
    }
    else{
      UIService.FlashMessage.displayFailureMessage( errorMessage )
    }
  }

  return { errors, errorMessage }
}
