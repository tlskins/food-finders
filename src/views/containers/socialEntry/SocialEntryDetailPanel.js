import { connect } from 'react-redux'

import SocialEntryDetailPanel from '@components/socialEntry/SocialEntryDetailPanel'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { socialEntry } = state
  const { tagSymbol, searchText } = socialEntry
  // const { visible } = socialEntry
  //
  // const draftSocialEntry = user ? user.draftSocialEntry : ''
  //
  return {
    tagSymbol,
    searchText,
  }
}

const mapDispatchToProps = () => {
  // const { RestService, TagService, SessionService, UIService } = services
  // const { pResponseGeneric, pResponseYelpBusinesses, pRequestUpdateSocialEntry } = presenters.Api
  // const pResponseUser = pResponseGeneric
  // const pResponseTags = pResponseGeneric
  //
  // const toggleVisibility = visible => UIService.SocialEntry.toggleVisibility(visible)
  // const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService, SessionService, pResponseUser, pRequestUpdateSocialEntry })
  // const postSocialEntry = coordinators.postSocialEntry({ RestService, SessionService, pResponseUser, pRequestUpdateSocialEntry })
  // const suggestTags = coordinators.suggestTags({ RestService, TagService, pResponseTags, pResponseYelpBusinesses })
  //
  // return {
  //   postSocialEntry,
  //   suggestTags,
  //   toggleVisibility,
  //   updateDraftSocialEntry,
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryDetailPanel)
