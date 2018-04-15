import { connect } from 'react-redux'

import LoginForm from '@components/user/LoginForm'

import coordinators from '@coordinators'
import services from '@services'
import presenters from '@presenters'
import { HandleError } from '@coordinators/composed'


const mapStateToProps = state => {
  const { loginFormPage, session } = state
  const errors = (state.errors && state.errors.loginForm) || {}
  const currentUser = session ? session.user : undefined

  return {
    currentUser,
    errors,
    mode: loginFormPage.mode,
  }
}


const mapDispatchToProps = () => {
  const { RestService, RouterService, SessionService, SocialEntryService, UIService } = services
  const { EmailSignIn, EmailSignUp } = coordinators
  const { pResponseUser } = presenters.Api

  const signIn = EmailSignIn({
    RestService,
    RouterService,
    SessionService,
    SocialEntryService,
    UIService,
    HandleError,
    pResponseUser
  })
  const signUp = EmailSignUp({ RestService, SessionService, UIService })
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
