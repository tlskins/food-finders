
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
  TaggablesService,
  UIService,
}) => async ({
  tagSymbol,
  text,
  searchText,
  cursorBeginIndex,
  cursorEndIndex,
}) => {
  SocialEntryService.updateSearchText({ tagSymbol, text, searchText, cursorBeginIndex, cursorEndIndex })
  const { edited: taggableEdited } = TaggablesService.getEditTaggable()

  if ( tagSymbol ) {
    const { creatableTags } = SocialEntryService.getSocialEntry()
    UpdateDraftSocialEntry(text, creatableTags)
    if ( tagSymbol && tagSymbol.length > 0 ) {
      await SuggestTags({ symbol: tagSymbol, text: searchText, resultsPerPage: 5, page: 1 })
      SocialEntryService.refreshTagSuggestions()

      // Trigger new taggable if no tags exist for a creatable tag symbol
      // TODO - need mapping table like one in TaggableManagerHeader but with the symbol... need mapping from API
      const { tagSuggestions } = SocialEntryService.getSocialEntry()
      if ( tagSymbol === '^' && tagSuggestions.length === 0 ) {
        if ( !taggableEdited ) {
          TaggablesService.newTaggable({ taggableType: 'foods', handle: searchText })
          UIService.SocialEntryDetailPanel.toggleMode('EDIT TAGGABLE')
        }
        else {
          TaggablesService.editTaggableHandle(searchText)
        }
      }
      else if ( taggableEdited ) {
        TaggablesService.resetTaggable()
      }
    }
  }
  else {
    SocialEntryService.resetSearchCriteria()
    if ( taggableEdited ) {
      TaggablesService.resetTaggable()
    }
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
