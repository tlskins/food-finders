import {
  UPDATE_SOCIAL_ENTRY,
} from '@actions/socialEntry'


const initialSocialEntryState = {
  creatableTags: [],
  cursorBeginIndex: 0,
  cursorEndIndex: 0,
  parentSocialEntry: null,
  searchText: null,
  searchHandles: null,
  selectedTagIndex: 0,
  tags: [],
  tagSuggestions: [],
  tagSymbol: null,
  text: null,
}

export const socialEntry = (state = initialSocialEntryState, action) => {
  switch (action.type) {
    case UPDATE_SOCIAL_ENTRY: {
      const {
        parentSocialEntry = state.parentSocialEntry,
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
        parentSocialEntry,
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
