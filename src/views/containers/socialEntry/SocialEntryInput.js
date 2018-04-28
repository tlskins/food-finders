import { connect } from 'react-redux'

import SocialEntryInput from '@components/socialEntry/SocialEntryInput'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { session, socialEntryForm, socialEntry, tagSearches } = state
  const { user } = session
  const { visible } = socialEntryForm
  const draftSocialEntry = user ? user.draftSocialEntry : {}

  return {
    draftSocialEntry,
    tagSearches,
    visible,
    ...socialEntry,
  }
}

const mapDispatchToProps = () => {
  const { RestService, TagService, TaggablesService, SessionService, SocialEntryService, UIService } = services
  const {
    pResponseGeneric,
    pResponseUser,
    pResponseSocialEntry,
    pResponseYelpBusinesses,
    pRequestUpdateSocialEntry,
    pRequestPostSocialEntry
  } = presenters.Api
  const pResponseTags = pResponseGeneric
  const UpdateDraftSocialEntry = coordinators.updateDraftSocialEntry({
    RestService,
    SessionService,
    pResponseUser,
    pRequestUpdateSocialEntry
  })
  const SuggestTags = coordinators.SuggestTags({ RestService, TagService, pResponseTags, pResponseYelpBusinesses })

  const addTagToText = coordinators.addTagToText({ SocialEntryService, UpdateDraftSocialEntry, TaggablesService })
  const loadDraftSocialEntry = draftSocialEntry => SocialEntryService.loadDraftSocialEntry(draftSocialEntry)
  const loadTagSuggestionsByHandles = coordinators.loadTagSuggestionsByHandles({
    SocialEntryService,
    SuggestTags,
    TagService,
  })
  const postSocialEntry = coordinators.postSocialEntry({
    RestService,
    SessionService,
    SocialEntryService,
    TaggablesService,
    pResponseUser,
    pRequestPostSocialEntry,
    UpdateDraftSocialEntry,
  })
  const resetSearchCriteria = () => SocialEntryService.resetSearchCriteria()
  const toggleVisibility = visible => UIService.SocialEntry.toggleVisibility(visible)
  const updateSearchText = coordinators.updateSearchText({
    SocialEntryService,
    SuggestTags,
    UpdateDraftSocialEntry,
    TagService,
    TaggablesService,
    UIService
  })
  const updateCursorTextData = coordinators.updateCursorTextData({
    SocialEntryService,
    UpdateDraftSocialEntry,
    TaggablesService,
    UIService,
    SuggestTags,
  })
  const updateSelectedTagIndex = coordinators.updateSelectedTagIndex({ SocialEntryService, SuggestTags })
  const loadParentSocialEntry = coordinators.loadParentSocialEntry({ RestService, SocialEntryService, SessionService, pResponseSocialEntry })

  return {
    addTagToText,
    loadParentSocialEntry,
    loadDraftSocialEntry,
    postSocialEntry,
    resetSearchCriteria,
    toggleVisibility,
    updateCursorTextData,
    loadTagSuggestionsByHandles,
    updateSearchText,
    updateSelectedTagIndex,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryInput)
