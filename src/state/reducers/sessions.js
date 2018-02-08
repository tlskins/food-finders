import {
  CLEAR_USER_SESSION,
  REFRESH_SESSION,
  SET_USER_SESSION,
} from '@actions/sessions'


export const session = ( state = null, action ) => {
  switch( action.type ) {
  case CLEAR_USER_SESSION:
    return null
  case REFRESH_SESSION:
    return {
      ...state,
      lastRefresh: Date(),
    }
  case SET_USER_SESSION:
    return {
      ...action.user,
      lastRefresh: Date(),
    }
  default:
    return state
  }
}
