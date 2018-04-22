import {
  CLEAR_ERRORS,
  UPDATE_ERRORS,
} from '@actions/ui/errors'


const initialState = {}


export const errors = ( state = initialState, action ) => {
  switch ( action.type ) {
  case CLEAR_ERRORS:
    return {}
  case UPDATE_ERRORS: {
    const { errors: errors_, namespace } = action
    const newErrors = { ...( state[namespace] || {}) }
    const newState = { ...state }
    for ( const k in errors_ ) {
      if ( errors_[k] === undefined ) {
        delete newErrors[k]
      }
      else {
        newErrors[k] = errors_[k]
      }
    }
    newState[namespace] = newErrors

    return newState
  }
  default:
    return state
  }
}
