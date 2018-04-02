import {
  UPDATE_SOCIAL_ENTRY,
} from '@actions/socialEntry'


const initialSocialEntryState = {
  searchText: null,
  searchHandles: null,
  tags: [],
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
        searchText = state.searchText,
        tags = state.tags,
        tagSuggestions = state.tagSuggestions,
        tagSymbol = state.tagSymbol,
        text = state.text,
        searchHandles = state.searchHandles,
        selectedTagIndex = state.selectedTagIndex,
        creatableTags = state.creatableTags,
        cursorBeginIndex = state.cursorBeginIndex,
        cursorEndIndex = state.cursorEndIndex,
      } = action

      return {
        ...state,
        searchText,
        tags,
        tagSuggestions,
        tagSymbol,
        text,
        searchHandles,
        selectedTagIndex,
        creatableTags,
        cursorBeginIndex,
        cursorEndIndex,
      }
    }

    default:
      return state
  }
}
