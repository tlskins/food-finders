import {
  FRIENDS_MANAGER_TOGGLE_VISIBILITY,
} from '@actions/ui/friendsManager'


const initialState = {
  visible: true,
}


export const friendsManager = ( state = initialState, action ) => {
  switch ( action.type ) {
  case FRIENDS_MANAGER_TOGGLE_VISIBILITY:
    return { visible: action.visible }
  default:
    return state
  }
}
