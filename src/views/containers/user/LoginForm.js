import { connect } from 'react-redux'

import LoginForm from '@components/user/LoginForm'

import coordinators from '@coordinators'
import services from '@services'
import { HandleError } from '@coordinators/composed'


const mapStateToProps = state => {
  const { loginFormPage } = state
  const errors = (state.errors && state.errors.loginForm) || {}

  return {
    currentUser: state.session,
    errors,
    mode: loginFormPage.mode,
  }
}


const mapDispatchToProps = () => {
  const { RestService, RouterService, SessionService, UIService } = services
  const { EmailSignIn, EmailSignUp } = coordinators

  const signIn = EmailSignIn({ RestService, RouterService, SessionService, UIService, HandleError })

  const signUp = EmailSignUp({ RestService, SessionService, UIService })

  // const resendConfirmation = coordinators.ResendConfirmation({ UIService, RestService })
  // const getNewPassword = coordinators.ForgotPassword({ RestService, SessionService, UIService })
  //
  // const close = () => RouterService.back()
  // const flashError = message => UIService.FlashMessage.displayFailureMessage( message )
  // const setErrors = errors => UIService.Errors.updateErrors({ errors, namespace: 'loginForm' })
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
