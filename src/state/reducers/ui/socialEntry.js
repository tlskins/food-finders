import {
  TOGGLE_SOCIAL_ENTRY_MODAL,
  SET_CURSOR_TEXT_DATA,
} from '@actions/ui/socialEntry'


const initialState = {
  visible: false,
  cursorBeginIndex: undefined,
  cursorEndIndex: undefined,
  tagSymbol: undefined,
  searchText: undefined,
}


export const socialEntry = ( state = initialState, action ) => {
  switch ( action.type ) {
  case TOGGLE_SOCIAL_ENTRY_MODAL:
    return { ...state, visible: action.visible }
  case SET_CURSOR_TEXT_DATA: {
    const { cursorBeginIndex, cursorEndIndex, tagSymbol, searchText } = action

    return { ...state, cursorBeginIndex, cursorEndIndex, tagSymbol, searchText }
  }
  default:
    return state
  }
}
