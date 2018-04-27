import React, { Component } from 'react'
import PropTypes from 'prop-types'


const initialState = {
  email: '',
  name: '',
  firstName: '',
  lastName: '',
  password: '',
  passwordConfirm: '',
}

class LoginForm extends Component {
  state = { ...initialState }

  componentDidMount() {
    window.scrollTo( 0, 0 )

    setTimeout(() => {
      const { currentUser, redirect } = this.props

      if ( currentUser ) {
        redirect()
      }
    }, 100 )
  }

  signIn = e => {
    e.preventDefault()

    const { email, password } = this.state

    this.props.signIn({ email, password })
  }

  signUp = e => {
    e.preventDefault()

    const { firstName, lastName, email, password, name } = this.state

    this.props.signUp({ firstName, lastName, email, password, name })
  }

  // Toggle between - Sign In, Sign Up
  toggleMode = ( e, mode ) => {
    e.preventDefault()

    this.setState({ ...this.initialState })

    this.props.toggleMode( mode )
  }

  onInput = ( e, fieldName ) => {
    const newState = {}
    newState[fieldName] = e.target.value
    this.setState( newState )
  }

  renderSignIn() {
    const { email, password } = this.state
    const { errors, redirect } = this.props

    return (
      <div className='login-page'>
        <h2> Sign In </h2>
        <div>
          <label htmlFor="email">
            Email Address
          </label>
          { errors && errors.email &&
            <div className="error-message"> { errors.email }</div>
          }
          <input id="email"
            type="email"
            value={ email }
            placeholder="jondoe@email.com"
            onInput={ e => this.onInput( e, 'email' ) }
          />
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>
          { errors && errors.password &&
            <div className="error-message"> { errors.password }</div>
          }
          <input id="password"
            type="password"
            value={ password }
            placeholder="∗∗∗∗"
            onInput={ e => this.onInput( e, 'password' ) }
            onKeyPress={ event => {
              if ( event.key === 'Enter' ) {
                this.signIn( event )
              }
            } }
          />
        </div>
        <div>
          <button value="submit" onClick={ this.signIn }> Sign In </button>
        </div>

        {
          /**
          <div className="check-box">
            <input id="sign-in-check"
              type="checkbox"
              value=""
            />
            <label htmlFor="sign-in-check"> Keep me signed in. </label>
          </div>
          **/
        }

        <div className="login-options">
          <div><div></div><p>New here?</p></div>
          <a href="signUp" onClick={ e => this.toggleMode( e, 'signUp' ) }> Create your account </a>
          <a href="guestLogIn" onClick={ redirect }> Proceed as guest </a>
        </div>
      </div>
    )
  }

  renderSignUp() {
    const {
      firstName,
      lastName,
      email,
      name,
      password,
      passwordConfirm,
    } = this.state
    const { errors } = this.props

    return (
      <div>
        <h2> Create a User </h2>
        <div>
          <label htmlFor="name">
            User Name*
          </label>
          { errors && errors.name &&
            <div className="error-message"> { errors.name }</div>
          }
          <input id="name"
            type="text"
            value={ name }
            placeholder="JoeDoe"
            onInput={ e => this.onInput( e, 'name' ) }
          />
        </div>

        <div>
          <label htmlFor="name">
            First Name*
          </label>
          { errors && errors.firstName &&
            <div className="error-message"> { errors.firstName }</div>
          }
          <input id="name"
            className={ errors && errors.firstName && 'input-error' }
            type="text"
            value={ firstName }
            placeholder="Jon"
            onInput={ e => this.onInput( e, 'firstName' ) }
          />
        </div>

        <div>
          <label htmlFor="last-name">
            Last Name*
          </label>
          { errors && errors.lastName &&
            <div className="error-message"> { errors.lastName }</div>
          }
          <input id="last-name"
            type="text"
            value={ lastName }
            placeholder="Doe"
            onInput={ e => this.onInput( e, 'lastName' ) }
          />
        </div>

        <div>
          <label htmlFor="email">
            Email Address*
          </label>
          { errors && errors.email &&
            <div className="error-message"> { errors.email }</div>
          }
          <input id="email"
            type="email"
            value={ email }
            placeholder="jondoe@email.com"
            onInput={ e => this.onInput( e, 'email' ) }
          />
        </div>
        <div>
          <label htmlFor="password">
            Create Password
          </label>
          { errors && errors.password &&
            <div className="error-message"> { errors.password }</div>
          }
          <input id="password"
            type="password"
            value={ password }
            placeholder="∗∗∗∗"
            onInput={ e => this.onInput( e, 'password' ) }
          />
        </div>

        <div>
          <label htmlFor="password2">
            Re-Enter Password
          </label>
          <input id="password2"
            type="password"
            value={ passwordConfirm }
            placeholder="∗∗∗∗"
            onInput = { e => this.setState({ passwordConfirm: e.target.value }) }
          />
        </div>

        <button value="submit" onClick={ this.signUp }> Create </button>
        <a href="/" onClick={ e => this.toggleMode( e, 'signIn' ) }> Back to Sign In </a>
      </div>
    )
  }

  render() {
    const { mode } = this.props

    return (
      <div>
        { mode === 'signIn' &&
          this.renderSignIn()
        }
        { mode === 'signUp' &&
          this.renderSignUp()
        }
      </div>
    )
  }
}


LoginForm.propTypes = {
  errors: PropTypes.object,
  mode: PropTypes.string,
  visible: PropTypes.bool,

  close: PropTypes.func,
  flashError: PropTypes.func,
  resendConfirmation: PropTypes.func,
  getNewPassword: PropTypes.func,
  setErrors: PropTypes.func,
  signIn: PropTypes.func,
  signUp: PropTypes.func,
  toggleFooterVisible: PropTypes.func,
  toggleMode: PropTypes.func,
  validateSignIn: PropTypes.func,
  validateSignUp: PropTypes.func,
  validateForgotPassword: PropTypes.func,
}


export default LoginForm
