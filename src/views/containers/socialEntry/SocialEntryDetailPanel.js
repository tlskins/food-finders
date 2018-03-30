import { connect } from 'react-redux'

import SocialEntryDetailPanel from '@components/socialEntry/SocialEntryDetailPanel'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { tags } = state
  const {
    text,
    tagSymbol,
    tagSuggestions,
    cursorBeginIndex,
    cursorEndIndex,
    selectedTagIndex,
   } = tags
   const activeTag = tagSuggestions && tagSuggestions[selectedTagIndex]

  return {
    activeTag,
    text,
    tagSymbol,
    cursorBeginIndex,
    cursorEndIndex,
  }
}

const mapDispatchToProps = () => {
  // const { RestService } = services
  // const { pResponseYelpBusinesses } = presenters.Api
  // // const pResponseUser = pResponseGeneric
  // // const pResponseTags = pResponseGeneric
  // //
  // const searchYelpBusinesses = coordinators.SearchYelpBusinesses({ RestService, pResponseYelpBusinesses })
  // // const toggleVisibility = visible => UIService.SocialEntry.toggleVisibility(visible)
  // // const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService, SessionService, pResponseUser, pRequestUpdateSocialEntry })
  // // const postSocialEntry = coordinators.postSocialEntry({ RestService, SessionService, pResponseUser, pRequestUpdateSocialEntry })
  // // const suggestTags = coordinators.suggestTags({ RestService, TagService, pResponseTags, pResponseYelpBusinesses })
  // //
  // return {
  //   searchYelpBusinesses,
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryDetailPanel)
