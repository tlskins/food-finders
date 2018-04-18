export const EmailSignUp = ({ RestService, UIService }) => async ({ firstName, lastName, email, password, name }) => {
  try {
    await RestService.post( '/users', { user: {
      first_name: firstName, last_name: lastName, email, password, name,
    }})
    // UIService.FlashMessage.displayInfoMessage( 'Please check your email to confirm your account.' )
    UIService.LoginForm.toggleMode( 'signIn' )
  }
  catch ( error ) {
    console.log('EmailSignUp error:',error)
    // HandleError({ error, namespace: 'loginForm' })
  }
}


export const EmailSignIn = ({
  RestService,
  RouterService,
  SessionService,
  SocialEntryService,
  UIService,
  HandleError,
  pResponseUser
}) => async ({ email, password }) => {
  try {
    let user = await RestService.post( '/users/sign_in', { email, password })
    user = pResponseUser( user )
    SessionService.setUserSession( user )
    RouterService.replace({ pathname: '/' })

    // load parent social entry if it is not loaded already
    // const { draftSocialEntry } = SessionService.currentUser()
    // const parentSocialEntryId = draftSocialEntry && draftSocialEntry.parentSocialEntryId
    // if ( parentSocialEntryId ) {
    //   const { parentSocialEntry } = SocialEntryService.getSocialEntry()
    //   if ( !parentSocialEntry ) {
    //     const socialEntry = await RestService.get('/newsfeed_items/' + parentSocialEntryId )
    //     SocialEntryService.setParentSocialEntry({ parentSocialEntry: socialEntry })
    //   }
    // }
  }
  catch ( error ) {
    HandleError({ error, namespace: 'loginForm'})
  }
}


export const SignOut = ({ RestService, SessionService, RouterService }) => async () => {
  try {
    await RestService.delete( '/users/sign_out' )
    SessionService.clearUserSession()
    RouterService.replace({ pathname: '/login' })
  }
  catch ( error ) {
    // HandleError({ error })
    console.log('SignOut error:',error)
  }
}


export const ConfirmEmail = ({ RestService, RouterService, SessionService, UIService, pResponseUser }) => async () => {
  try {
    const token = RouterService.getState().routing.location.search
    let user = await RestService.get( `/users/confirmation${ token }` )
    user = pResponseUser( user )
    SessionService.setUserSession( user )
    RouterService.push({ pathname: '/' })
    // UIService.FlashMessage.displaySuccessMessage( 'Email successfully confirmed!' )
  }
  catch ( error ) {
    // HandleError({ error, namespace: 'confirmEmail' })
    console.log('ConfirmEmail error:',error)
  }
}


// export const ResendConfirmation = ({ UIService, RestService }) => async ({ email }) => {
//   try {
//     await RestService.post( '/api/marketplace/marketplace_users/confirmation', { user: { email }})
//     // UIService.FlashMessage.displayInfoMessage( 'Please check your email for a new confirmation message.' )
//   }
//   catch ( error ) {
//     // HandleError({ error })
//     console.log('ResendConfirmation error:',error)
//   }
// }


export const UpdatePassword = ({ RestService, SessionService, UIService }) => async ({ password, passwordConfirm }) => {
  // const { errors, errorMessage } = UIService.Password.validate({ password, passwordConfirm })
  // if ( errorMessage ) {
  //   UIService.Errors.updateErrors( errors )
  //   UIService.FlashMessage.displayFailureMessage( errorMessage )
  //
  //   return
  // }
  // else {
  //   UIService.Errors.clear()
  // }

  const userId =  SessionService.getState().user.id

  try {
    await RestService.put( `/users/password/${ userId }`, { password })
    // UIService.FlashMessage.displaySuccessMessage( 'Your password has been updated' )
    SessionService.refreshSession()
  }
  catch ( error ) {
    // HandleError({ error, namespace: 'updatePassword' })
    console.log('UpdatePassword error:',error)
  }
}


export const ForgotPassword = ({ RestService, UIService }) => async ({ email }) => {
  try {
    await RestService.post( '/users/password/', { user: { email }})
    // UIService.FlashMessage.displaySuccessMessage( 'An email has been sent to reset your password' )
  }
  catch ( error ) {
    // HandleError({ error, namespace: 'loginForm' })
    console.log('ForgotPassword error:',error)
  }
}
