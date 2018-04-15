export const UPDATE_SOCIAL_ENTRY = 'UPDATE_SOCIAL_ENTRY'


export const updateSocialEntry = ({
  parentSocialEntry,
  searchText,
  tagSuggestions,
  tagSymbol,
  text,
  searchHandles,
  selectedTagIndex,
  creatableTags,
  cursorBeginIndex,
  cursorEndIndex,
}) => ({
  type: UPDATE_SOCIAL_ENTRY,
  parentSocialEntry,
  searchText,
  tagSuggestions,
  tagSymbol,
  text,
  searchHandles,
  selectedTagIndex,
  creatableTags,
  cursorBeginIndex,
  cursorEndIndex,
})
