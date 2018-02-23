import {
  TOGGLE_SOCIAL_ENTRY_MODAL,
} from '@actions/ui/socialEntry'


const initialState = {
  visible: false,
}


export const socialEntry = ( state = initialState, action ) => {
  switch ( action.type ) {
  case TOGGLE_SOCIAL_ENTRY_MODAL:
    return { visible: action.visible }
  default:
    return state
  }
}
