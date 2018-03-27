import {
  SET_CURSOR_TEXT_DATA,
} from '@actions/socialEntry'

const initialSocialEntryState = {
  cursorBeginIndex: undefined,
  cursorEndIndex: undefined,
  tagSymbol: undefined,
  searchText: undefined,
}

export const socialEntry = (state = initialSocialEntryState, action) => {
  switch (action.type) {
    case SET_CURSOR_TEXT_DATA: {
      const { cursorBeginIndex, cursorEndIndex, tagSymbol, searchText } = action
      state = { ...state, cursorBeginIndex, cursorEndIndex, tagSymbol, searchText }

      return state
    }

    default:
      return state
  }
}
