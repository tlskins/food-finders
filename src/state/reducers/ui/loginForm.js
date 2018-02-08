import {
  LOGIN_FORM_TOGGLE_MODE,
} from '@actions/ui/loginForm'


const initialState = {
  mode: 'signIn',
}


export const loginFormPage = ( state = initialState, action ) => {
  switch ( action.type ) {
  case LOGIN_FORM_TOGGLE_MODE:
    return {
      ...state,
      mode: action.mode,
    }
  default:
    return state
  }
}
