import {
  CLEAR_USER_SESSION,
  REFRESH_SESSION,
  SET_USER_SESSION,
} from '@actions/sessions'

const sessionInitialState = { user: undefined, lastRefresh: undefined, requestedAt: undefined }

export const session = ( state = sessionInitialState, action ) => {
  switch( action.type ) {
  case CLEAR_USER_SESSION:
    return null
  case REFRESH_SESSION:
    return {
      ...state,
      lastRefresh: Date(),
    }
  case SET_USER_SESSION: {
    return {
      user: {...action.user},
      lastRefresh: Date(),
      requestedAt: action.requestedAt,
    }
  }
  default:
    return state
  }
}
