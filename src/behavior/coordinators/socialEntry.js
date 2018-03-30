
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
}) => async ({
  tagSymbol,
  text,
  searchText,
  cursorBeginIndex,
  cursorEndIndex,
}) => {
  SocialEntryService.updateSearchText({ tagSymbol, text, searchText, cursorBeginIndex, cursorEndIndex })
  if ( tagSymbol ) {
    const { creatableTags } = SocialEntryService.getSocialEntry()
    UpdateDraftSocialEntry(text, creatableTags)
    await SuggestTags({ symbol: tagSymbol, text: searchText, resultsPerPage: 5, page: 1 })
    SocialEntryService.refreshTagSuggestions()
  }
  else {
    SocialEntryService.resetSearchCriteria()
  }
}


export const updateSearchHandles = ({ SocialEntryService, SuggestTags }) => async ({
  tagSymbol,
  searchHandles,
  selectedTagIndex,
}) => {
  SocialEntryService.updateSearchHandles({ tagSymbol, searchHandles, selectedTagIndex })
  if ( tagSymbol ) {
    await SuggestTags({ symbol: tagSymbol, handles: searchHandles, resultsPerPage: 5, page: 1 })
    SocialEntryService.refreshTagSuggestions()
  }
  else {
    SocialEntryService.resetSearchCriteria()
  }
}


export const addTagToText = ({ SocialEntryService, UpdateDraftSocialEntry }) => async ( tag ) => {
  SocialEntryService.addTagToText( tag )
  const { creatableTags, text } = SocialEntryService.getSocialEntry()
  UpdateDraftSocialEntry(text, creatableTags)
}
