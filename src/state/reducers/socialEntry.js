import {
  UPDATE_SOCIAL_ENTRY,
} from '@actions/socialEntry'


const initialSocialEntryState = {
  searchText: null,
  searchHandles: null,
  tagSuggestions: [],
  tagSymbol: null,
  text: '',
  creatableTags: [],
  cursorBeginIndex: 0,
  cursorEndIndex: 0,
  selectedTagIndex: 0,
}

export const socialEntry = (state = initialSocialEntryState, action) => {
  switch (action.type) {
    case UPDATE_SOCIAL_ENTRY: {
      const {
        searchText: oldSearchText,
        tagSuggestions: oldTagSuggestions,
        tagSymbol: oldTagSymbol,
        text: oldText,
        searchHandles: oldSearchHandles,
        selectedTagIndex: oldSelectedTagIndex,
        creatableTags: oldCreatableTags,
        cursorBeginIndex: oldCursorBeginIndex,
        cursorEndIndex: oldCursorEndIndex,
      } = state

      const {
        searchText = oldSearchText,
        tagSuggestions = oldTagSuggestions,
        tagSymbol = oldTagSymbol,
        text = oldText,
        searchHandles = oldSearchHandles,
        selectedTagIndex = oldSelectedTagIndex,
        creatableTags = oldCreatableTags,
        cursorBeginIndex = oldCursorBeginIndex,
        cursorEndIndex = oldCursorEndIndex,
      } = action

      return {
        ...state,
        searchText,
        tagSuggestions,
        tagSymbol,
        text,
        searchHandles,
        selectedTagIndex,
        creatableTags,
        cursorBeginIndex,
        cursorEndIndex,
      }

      // return { ...state, ...action }
    }

    default:
      return state
  }
}
