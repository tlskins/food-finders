export const TOGGLE_SOCIAL_ENTRY_MODAL = 'TOGGLE_SOCIAL_ENTRY_MODAL'

export const SET_CURSOR_TEXT_DATA = 'SET_CURSOR_TEXT_DATA'


export const setCursorTextData = ({
  cursorBeginIndex,
  cursorEndIndex,
  tagSymbol,
  searchText }) => ({
    type: SET_CURSOR_TEXT_DATA,
    cursorBeginIndex,
    cursorEndIndex,
    tagSymbol,
   })

export const toggleSocialEntryModal = visible => ({ type: TOGGLE_SOCIAL_ENTRY_MODAL, visible })
