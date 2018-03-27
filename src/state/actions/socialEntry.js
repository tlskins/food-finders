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
