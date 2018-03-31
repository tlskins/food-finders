import {
  TOGGLE_SOCIAL_ENTRY_MODAL,
} from '@actions/ui/socialEntry'


const initialState = { visible: false }

export const socialEntryForm = ( state = initialState, action ) => {
  switch ( action.type ) {
  case TOGGLE_SOCIAL_ENTRY_MODAL:
    return { ...state, visible: action.visible }
  default:
    return state
  }
}
