export const UPDATE_SOCIAL_ENTRY = 'UPDATE_SOCIAL_ENTRY'


export const updateSocialEntry = ({
  parentSocialEntry,
  parentSocialEntryId,
  searchText,
  tagSuggestions,
  tagSymbol,
  text,
  searchHandles,
  selectedTagIndex,
  childTagSuggestions,
  creatableTags,
  cursorBeginIndex,
  cursorEndIndex,
}) => ({
  type: UPDATE_SOCIAL_ENTRY,
  parentSocialEntry,
  parentSocialEntryId,
  searchText,
  tagSuggestions,
  tagSymbol,
  text,
  searchHandles,
  selectedTagIndex,
  childTagSuggestions,
  creatableTags,
  cursorBeginIndex,
  cursorEndIndex,
})
