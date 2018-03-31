import {
  SOCIAL_ENTRY_DETAIL_PANEL_TOGGLE_MODE,
} from '@actions/ui/socialEntryDetailPanel'


const initialState = { mode: 'DISPLAY ENTITY' }

export const socialEntryDetailPanel = ( state = initialState, action ) => {
  switch ( action.type ) {
  case SOCIAL_ENTRY_DETAIL_PANEL_TOGGLE_MODE:
    return { ...state, mode: action.mode }
  default:
    return state
  }
}
