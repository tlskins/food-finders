import { connect } from 'react-redux'

import SocialEntryInput from '@components/socialEntry/SocialEntryInput'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { session, socialEntry, tags, tagSearches } = state
  const { user } = session
  const { visible } = socialEntry
  const {
    searchText,
    searchHandles,
    tagSuggestions,
    tagSymbol,
    cursorBeginIndex,
    cursorEndIndex,
    selectedTagIndex,
   } = tags

  const draftSocialEntry = user ? user.draftSocialEntry : ''

  return {
    cursorBeginIndex,
    cursorEndIndex,
    draftSocialEntry,
    tagSuggestions,
    tagSymbol,
    searchText,
    searchHandles,
    selectedTagIndex,
    tagSearches,
    visible,
  }
}

const mapDispatchToProps = () => {
  const { RestService, TagService, SessionService, UIService } = services
  const { pResponseGeneric, pResponseYelpBusinesses, pRequestUpdateSocialEntry } = presenters.Api
  const pResponseUser = pResponseGeneric
  const pResponseTags = pResponseGeneric

  const toggleVisibility = visible => UIService.SocialEntry.toggleVisibility(visible)
  const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService, SessionService, pResponseUser, pRequestUpdateSocialEntry })
  const postSocialEntry = coordinators.postSocialEntry({ RestService, SessionService, pResponseUser, pRequestUpdateSocialEntry })
  const suggestTags = coordinators.suggestTags({ RestService, TagService, pResponseTags, pResponseYelpBusinesses })
  const updateSearchText = ({
    tagSymbol,
    searchText,
    cursorBeginIndex,
    cursorEndIndex,
    selectedTagIndex,
  }) => TagService.updateSearchText({
    tagSymbol,
    searchText,
    cursorBeginIndex,
    cursorEndIndex,
    selectedTagIndex,
  })
  const updateSearchHandles = ({
    tagSymbol,
    searchHandles,
    selectedTagIndex,
    text,
  }) => TagService.updateSearchHandles({
    tagSymbol,
    searchHandles,
    selectedTagIndex,
    text,
  })
  const resetSearchCriteria = () => TagService.resetSearchCriteria()
  const updateSelectedTagIndex = selectedTagIndex => TagService.updateSelectedTagIndex(selectedTagIndex)


  return {
    postSocialEntry,
    resetSearchCriteria,
    suggestTags,
    toggleVisibility,
    updateSearchHandles,
    updateSearchText,
    updateSelectedTagIndex,
    updateDraftSocialEntry,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryInput)
