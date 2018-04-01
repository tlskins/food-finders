
export const loadDraftSocialEntry = ({ RestService, SessionService, pResponseUser }) => async () => {
  const userId = SessionService.currentUserId()
  let user = await RestService.get('/users/' + userId )
  user = pResponseUser( user )
  SessionService.setUserSession( user )
}


export const updateDraftSocialEntry = ({
  RestService,
  SessionService,
  pResponseUser,
  pRequestUpdateSocialEntry
}) => async (text, creatableTags, requestedAt = new Date()) => {
  console.log('COORDINATOR updateDraftSocialEntry BEGIN')
  const userId = SessionService.currentUserId()
  const payload = pRequestUpdateSocialEntry({ text, creatableTags })

  let user = await RestService.put('/users/' + userId, payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user, requestedAt)
}


export const postSocialEntry = ({
  RestService,
  SessionService,
  pResponseUser,
  pRequestUpdateSocialEntry
}) => async (text, creatableTags) => {
  const userId = SessionService.currentUserId()
  const payload = pRequestUpdateSocialEntry({ text, creatableTags })

  let user = await RestService.post('/users/' + userId + '/publish_draft_social_entry', payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user)
}


export const updateSearchText = ({
  SocialEntryService,
  SuggestTags,
  UpdateDraftSocialEntry,
  TaggablesService,
  UIService,
}) => async ({
  tagSymbol,
  text,
  searchText,
  cursorBeginIndex,
  cursorEndIndex,
}) => {
  console.log('COORDINATOR updateSearchText ',{ tagSymbol, text, searchText, cursorBeginIndex, cursorEndIndex })
  const { creatableTags, tagSuggestions } = SocialEntryService.getSocialEntry()
  const editTaggable = TaggablesService.getEditTaggable()
  const { edited } = editTaggable

  // creatable tags
  if ( edited ) {
    if ( tagSymbol ) {
      TaggablesService.editTaggableHandle(searchText)
      UIService.SocialEntryDetailPanel.toggleMode('EDIT TAGGABLE')
    }
    else {
      addTagToText({ SocialEntryService, UpdateDraftSocialEntry })(editTaggable, false)
      TaggablesService.resetTaggable()
      UIService.SocialEntryDetailPanel.toggleMode('NONE')
    }
  }
  else if ( tagSymbol === '^' && tagSuggestions.length === 0 ) {
    const creatableFoodTag = creatableTags.find( t => t.symbol === '^' && t.handle === searchText )
    if ( !creatableFoodTag ) {
      TaggablesService.newTaggable({ taggableType: 'Food', symbol: '^', handle: searchText })
    }
    else {
      TaggablesService.loadNewTaggable(creatableFoodTag.taggableType, creatableFoodTag.taggableObject)
    }
    UIService.SocialEntryDetailPanel.toggleMode('EDIT TAGGABLE')
  }
  else {
    UIService.SocialEntryDetailPanel.toggleMode('NONE')
  }

  // tag suggestions
  SocialEntryService.updateSearchText({ tagSymbol, text, searchText, cursorBeginIndex, cursorEndIndex })
  await SuggestTags({ symbol: tagSymbol, text: searchText, resultsPerPage: 5, page: 1 })
  SocialEntryService.refreshTagSuggestions()
  if ( tagSymbol ) {
    UpdateDraftSocialEntry(text, creatableTags)
  }
  console.log('COORDINATOR updateSearchText END')
}


export const updateCursorTextData = ({
  SocialEntryService,
  UpdateDraftSocialEntry,
  TaggablesService,
  UIService,
}) => async ({
  tagSymbol,
  text,
  searchText,
  cursorBeginIndex,
  cursorEndIndex,
}) => {
  console.log('COORDINATOR updateCursorTextData BEGIN')
  // Save any edited taggable to creatable tag
  const editTaggable = TaggablesService.getEditTaggable()
  const { edited: taggableEdited } = editTaggable
  if ( taggableEdited ) {
    addTagToText({ SocialEntryService, UpdateDraftSocialEntry })(editTaggable, false)
    TaggablesService.resetTaggable()
  }

  if ( tagSymbol ) {
    if ( tagSymbol === '^') {
      const { creatableTags } = SocialEntryService.getSocialEntry()
      const creatableFoodTag = creatableTags.find( t => t.symbol === '^' && t.handle === searchText )
      if ( creatableFoodTag ) {
        TaggablesService.loadNewTaggable(creatableFoodTag.taggableType, creatableFoodTag.taggableObject)
        UIService.SocialEntryDetailPanel.toggleMode('EDIT TAGGABLE')
        SocialEntryService.updateSearchText({ tagSymbol, searchText, text, cursorBeginIndex, cursorEndIndex })
        return
      }
    }
  }

  SocialEntryService.updateSearchText({ tagSymbol, tagSuggestions: [], searchText, text, cursorBeginIndex, cursorEndIndex })
  UIService.SocialEntryDetailPanel.toggleMode('NONE')
}


export const updateSearchHandles = ({ SocialEntryService, SuggestTags }) => async ({
  tagSymbol,
  searchHandles,
  selectedTagIndex,
}) => {
  console.log('COORDINATOR updateSearchHandles BEGIN')
  SocialEntryService.updateSearchHandles({ tagSymbol, searchHandles, selectedTagIndex })
  if ( tagSymbol ) {
    await SuggestTags({ symbol: tagSymbol, handles: searchHandles, resultsPerPage: 5, page: 1 })
    SocialEntryService.refreshTagSuggestions()
  }
  else {
    SocialEntryService.resetSearchCriteria()
  }
}


export const addTagToText = ({ SocialEntryService, UpdateDraftSocialEntry }) => async ( tag, updateText = true ) => {
  console.log('COORDINATOR addTagToText BEGIN')
  SocialEntryService.addTagToText(tag, updateText)
  const { creatableTags, text } = SocialEntryService.getSocialEntry()
  UpdateDraftSocialEntry(text, creatableTags)
}
