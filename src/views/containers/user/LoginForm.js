import { connect } from 'react-redux'

import LoginForm from '@components/user/LoginForm'

import coordinators from '@coordinators'
import services from '@services'
import presenters from '@presenters'
import { HandleError } from '@coordinators/composed'


const mapStateToProps = state => {
  const { loginFormPage, session, errors } = state
  const { mode } = loginFormPage
  let errors_
  if ( mode === 'signIn') {
    errors_ = (errors && errors.loginForm) || {}
  } else if ( mode === 'signUp' ) {
    errors_ = (errors && errors.signUpForm) || {}
  }
  const currentUser = session ? session.user : undefined

  return {
    currentUser,
    errors: errors_,
    mode,
  }
}


const mapDispatchToProps = () => {
  const { RestService, RouterService, SessionService, SocialEntryService, UIService } = services
  const { EmailSignIn, EmailSignUp } = coordinators
  const { pResponseUser, pResponseSocialEntry } = presenters.Api

  const signIn = EmailSignIn({
    RestService,
    RouterService,
    SessionService,
    SocialEntryService,
    UIService,
    HandleError,
    pResponseUser,
    pResponseSocialEntry,
  })
  const signUp = EmailSignUp({ RestService, HandleError, UIService })
  const toggleMode = mode => UIService.LoginForm.toggleMode( mode )
  const redirect = () => RouterService.replace({ pathname: '/' })

  return {
    redirect,
    signIn,
    signUp,
    toggleMode,
  }
}


export default connect( mapStateToProps, mapDispatchToProps )( LoginForm )
