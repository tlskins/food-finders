
export const updateDraftSocialEntry = ({
  RestService,
  SessionService,
  SocialEntryService,
  pResponseUser,
  pRequestUpdateSocialEntry
}) => async (text, creatableTags, requestedAt = new Date()) => {
  const userId = SessionService.currentUserId()
  const { parentSocialEntryId } = SocialEntryService.getSocialEntry()
  const payload = pRequestUpdateSocialEntry({
    text,
    creatableTags,
    parentSocialEntryId,
  })

  let user = await RestService.put('/api/users/' + userId, payload )
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
  const { actionableId } = parentSocialEntry
  const payload = pRequestUpdateSocialEntry({
    text: '',
    creatableTags: [],
    parentSocialEntryId: actionableId
  })

  let user = await RestService.put('/api/users/' + userId, payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user, requestedAt)
  SocialEntryService.setParentSocialEntry({ parentSocialEntry })
  UIService.SocialEntry.toggleVisibility(true)
}


export const loadParentSocialEntry = ({ RestService, SocialEntryService, SessionService, pResponseSocialEntry }) => async parentSocialEntryId => {
  const payload = { actionable_id: parentSocialEntryId }
  let parentSocialEntry = await RestService.get('/api/actionables/', payload )
  parentSocialEntry = pResponseSocialEntry(parentSocialEntry[0])
  SocialEntryService.setParentSocialEntry({ parentSocialEntry })
}


export const postSocialEntry = ({
  ActionablesService,
  RestService,
  SessionService,
  SocialEntryService,
  TaggablesService,
  UIService,
  pResponseUser,
  pRequestPostSocialEntry,
  pResponseSocialEntries,
  UpdateDraftSocialEntry,
}) => async () => {
  // write any unsaved taggable edits
  const editTaggable = TaggablesService.getEditTaggable()
  const { edited } = editTaggable
  if ( edited ) {
    addTagToText({ SocialEntryService, UpdateDraftSocialEntry, TaggablesService })(editTaggable, false)
    TaggablesService.resetTaggable()
  }

  const userId = SessionService.currentUserId()
  const socialEntry = SocialEntryService.getSocialEntry()
  const { text, creatableTags, parentSocialEntryId } = socialEntry
  let payload = pRequestPostSocialEntry({
    text,
    creatableTags,
    parentSocialEntryId,
  })

  let user = await RestService.post('/api/users/' + userId + '/publish_draft_social_entry', payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user)

  if ( parentSocialEntryId ) {
    const { parentSocialEntry } = socialEntry
    const { parentSocialEntryId: grandParentSocialEntryId } = parentSocialEntry
    payload = { social_entry_ids: [parentSocialEntryId, grandParentSocialEntryId] }
    let updatedActionables = await RestService.get('/api/actionables/find', payload )
    updatedActionables = pResponseSocialEntries(updatedActionables)
    ActionablesService.loadNewsfeed(updatedActionables)
    UIService.Home.updateClickedNewsfeedItem()
  }
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
    _updateEditTaggable({ TaggablesService, SocialEntryService, UIService, tagSymbol, searchText })
  }
  else {
    const createNew = tagSuggestions.length === 0
    _loadOrBuildCreatableTaggable({ TaggablesService, SocialEntryService, UIService,tagSymbol, searchText, createNew })
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
    addTagToText({ SocialEntryService, UpdateDraftSocialEntry, TaggablesService })(editTaggable, false)
    TaggablesService.resetTaggable()
  }

  if ( tagSymbol ) {
    const loaded = _loadOrBuildCreatableTaggable({ tagSymbol, TaggablesService, SocialEntryService, UIService, searchText })
    if ( loaded ) {
      SocialEntryService.updateSearchText({ tagSymbol, searchText, text, cursorBeginIndex, cursorEndIndex })
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


export const addTagToText = ({ SocialEntryService, UpdateDraftSocialEntry, TaggablesService }) => async ( tag, updateText = true ) => {
  SocialEntryService.addTagToText(tag, updateText)
  TaggablesService.resetTaggable()
  const { creatableTags, text } = SocialEntryService.getSocialEntry()
  UpdateDraftSocialEntry(text, creatableTags)
}

// Helpers

const _updateEditTaggable = ({ TaggablesService, SocialEntryService, UIService, tagSymbol, searchText }) => {
  const editTaggable = TaggablesService.getEditTaggable()
  if ( tagSymbol ) {
    TaggablesService.editTaggableHandle(searchText)
    UIService.SocialEntryDetailPanel.toggleMode('EDIT TAGGABLE')
  }
  else {
    SocialEntryService.addTaggableToCreatableTags(editTaggable)
    TaggablesService.resetTaggable()
    UIService.SocialEntryDetailPanel.toggleMode('NONE')
  }
}

const _loadOrBuildCreatableTaggable = ({ TaggablesService, SocialEntryService, UIService, tagSymbol, searchText, createNew }) => {
  if ( tagSymbol === '^' && searchText && searchText.length > 0 ) {
    const { creatableTags } = SocialEntryService.getSocialEntry()
    const creatableFoodTag = creatableTags.find( t => t.symbol === '^' && t.handle === searchText )
    if ( !creatableFoodTag ) {
      if ( createNew ) {
        TaggablesService.newTaggable({ taggableType: 'Food', symbol: '^', handle: searchText })
      }
      else {
        UIService.SocialEntryDetailPanel.toggleMode('NONE')
        return false
      }
    }
    else {
      TaggablesService.loadNewTaggable(creatableFoodTag.taggableType, creatableFoodTag.taggableObject)
    }
    UIService.SocialEntryDetailPanel.toggleMode('EDIT TAGGABLE')
    return true
  }
  UIService.SocialEntryDetailPanel.toggleMode('NONE')
  return false
}

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
