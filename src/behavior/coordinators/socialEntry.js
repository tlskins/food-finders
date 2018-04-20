
// export const loadDraftSocialEntry = ({ RestService, SessionService, SocialEntryService, pResponseUser }) => async () => {
//   console.log('loadDraftSocialEntry')
//   const userId = SessionService.currentUserId()
//   let user = await RestService.get('/users/' + userId )
//   user = pResponseUser( user )
//   SessionService.setUserSession( user )
//
//   const { draftSocialEntry } = SessionService.currentUser()
//   const parentSocialEntryId = draftSocialEntry && draftSocialEntry.parentSocialEntryId
//   if ( parentSocialEntryId ) {
//     const { parentSocialEntry } = SocialEntryService.getSocialEntry()
//     if ( !parentSocialEntry ) {
//       const socialEntry = await RestService.get('/social_entries/' + parentSocialEntryId )
//       SocialEntryService.setParentSocialEntry({ parentSocialEntry: socialEntry })
//     }
//   }
// }


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


export const newReplySocialEntry = ({
  RestService,
  SessionService,
  UIService,
  SocialEntryService,
  pResponseUser,
  pRequestUpdateSocialEntry,
}) => async (parentSocialEntry, requestedAt = new Date()) => {
  const userId = SessionService.currentUserId()
  const { id } = parentSocialEntry
  const payload = pRequestUpdateSocialEntry({
    text: '',
    creatableTags: [],
    parentSocialEntryId: id
  })

  let user = await RestService.put('/users/' + userId, payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user, requestedAt)
  SocialEntryService.setParentSocialEntry({ parentSocialEntry })
  UIService.SocialEntry.toggleVisibility(true)
}


export const postSocialEntry = ({
  RestService,
  SessionService,
  SocialEntryService,
  TaggablesService,
  pResponseUser,
  pRequestPostSocialEntry,
  UpdateDraftSocialEntry,
}) => async () => {
  // write any unsaved taggable edits
  const editTaggable = TaggablesService.getEditTaggable()
  const { edited } = editTaggable
  if ( edited ) {
    addTagToText({ SocialEntryService, UpdateDraftSocialEntry })(editTaggable, false)
    TaggablesService.resetTaggable()
  }

  const userId = SessionService.currentUserId()
  const socialEntry = SocialEntryService.getSocialEntry()
  const { text, creatableTags } = socialEntry
  const payload = pRequestPostSocialEntry({ text, creatableTags })

  let user = await RestService.post('/users/' + userId + '/publish_draft_social_entry', payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user)
}


export const updateSearchText = ({
  SocialEntryService,
  SuggestTags,
  UpdateDraftSocialEntry,
  TagService,
  TaggablesService,
  UIService,
}) => async ({
  tagSymbol,
  text,
  searchText,
  cursorBeginIndex,
  cursorEndIndex,
}) => {
  // creatable tags
  const { creatableTags, tagSuggestions } = SocialEntryService.getSocialEntry()
  const editTaggable = TaggablesService.getEditTaggable()
  const { edited } = editTaggable
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
  if ( tagSymbol ) {
    const newTagsFound = await SuggestTags({ symbol: tagSymbol, text: searchText, resultsPerPage: 5, page: 1 })
    if ( newTagsFound ) {
      SocialEntryService.refreshTagSuggestions()
    }
    _findAnyNewChildTags({ SocialEntryService, SuggestTags })
    UpdateDraftSocialEntry(text, creatableTags)
  }
}


export const updateSelectedTagIndex = ({ SocialEntryService, SuggestTags }) => ( selectedTagIndex ) => {
  SocialEntryService.updateSelectedTagIndex(selectedTagIndex)
  _findAnyNewChildTags({ SocialEntryService, SuggestTags })
}


export const updateCursorTextData = ({
  SocialEntryService,
  UpdateDraftSocialEntry,
  TaggablesService,
  UIService,
  SuggestTags,
}) => async ({
  tagSymbol,
  text,
  searchText,
  cursorBeginIndex,
  cursorEndIndex,
}) => {
  // Save any edited taggable to creatable tag
  const editTaggable = TaggablesService.getEditTaggable()
  const { edited: taggableEdited } = editTaggable
  if ( taggableEdited ) {
    // TODO - refactor out creatable tag logic from addTag
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
  else {
    SocialEntryService.updateSearchText({ tagSymbol, tagSuggestions: [], searchText, text, cursorBeginIndex, cursorEndIndex })
    UIService.SocialEntryDetailPanel.toggleMode('NONE')
  }
  _findAnyNewChildTags({ SocialEntryService, SuggestTags })
}


export const loadTagSuggestionsByHandles = ({ SocialEntryService, TagService, SuggestTags }) => async ({
  tagSymbol,
  searchHandles,
  selectedTagIndex,
  selectedTagHandle,
}) => {
  SocialEntryService.loadTagSuggestionsByHandles({ tagSymbol, searchHandles, selectedTagIndex })
  if ( tagSymbol ) {
    const childHandles = _getChildHandles({ TagService, tagSymbol, handle: selectedTagHandle })
    searchHandles = searchHandles.concat(childHandles)
    const newTagsFound = await SuggestTags({ symbol: tagSymbol, handles: searchHandles, resultsPerPage: 5, page: 1 })
    if ( newTagsFound ) {
      SocialEntryService.refreshTagSuggestions()
    }
  }
  else {
    SocialEntryService.resetSearchCriteria()
  }
}


export const addTagToText = ({ SocialEntryService, UpdateDraftSocialEntry }) => async ( tag, updateText = true ) => {
  SocialEntryService.addTagToText(tag, updateText)
  const { creatableTags, text } = SocialEntryService.getSocialEntry()
  UpdateDraftSocialEntry(text, creatableTags)
}

// Helpers

const _getChildHandles = ({ tagSymbol, handle, TagService }) => {
  const tag = TagService.getTag(tagSymbol, handle)
  if ( !tag || !tag.children ) {
    return []
  }
  else {
    return tag.children
  }
}

const _findAnyNewChildTags = async ({ SocialEntryService, SuggestTags }) => {
  const selectedTag = SocialEntryService.getSelectedTag()
  const { tagSymbol } = SocialEntryService.getSocialEntry()
  if ( selectedTag && selectedTag.embeddedTaggable && selectedTag.embeddedTaggable.children ) {
    const { children: childHandles } = selectedTag.embeddedTaggable
    if ( childHandles.length > 0 ) {
      const newTagsFound = await SuggestTags({ symbol: tagSymbol, handles: childHandles, resultsPerPage: 5, page: 1 })
      if ( newTagsFound ) {
        SocialEntryService.refreshTagSuggestions()
      }
    }
  }
}
