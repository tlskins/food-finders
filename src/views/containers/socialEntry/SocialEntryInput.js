import { connect } from 'react-redux'

import SocialEntryInput from '@components/socialEntry/SocialEntryInput'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { session, socialEntry, tags, tagSearches } = state
  const { requestedAt, user } = session
  const { visible } = socialEntry

  const draftSocialEntry = user ? user.draftSocialEntry : ''

  return {
    draftSocialEntry,
    tags,
    tagSearches,
    user,
    requestedAt,
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

  return {
    postSocialEntry,
    suggestTags,
    toggleVisibility,
    updateDraftSocialEntry,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryInput)
