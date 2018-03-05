import { connect } from 'react-redux'

import SocialEntryInput from '@components/home/SocialEntryInput'

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
    // entities,
    // foods,
    // hashtags,
    tags,
    tagSearches,
    requestedAt,
    visible,
  }
}

const mapDispatchToProps = () => {
  // const { RestService, EntityService, FoodService, HashtagService, SessionService, UIService } = services
  const { RestService, TagService, SessionService, UIService } = services
  const { pResponseGeneric, pResponseYelpBusinesses } = presenters.Api
  const pResponseUser = pResponseGeneric
  const pResponseTags = pResponseGeneric
//
  const toggleVisibility = visible => UIService.SocialEntry.toggleVisibility(visible)
  const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService, SessionService, pResponseUser })
  const postSocialEntry = coordinators.postSocialEntry({ RestService, SessionService, pResponseUser })
  const suggestTags = coordinators.suggestTags({ RestService, TagService, pResponseTags, pResponseYelpBusinesses })
  // const suggestYelp = coordinators.suggestYelp({ RestService, pResponseYelpBusinesses })
  // const { addEntities, addYelpBusinessEntities } = EntityService
  // const { addFoods } = FoodService
  // const { addHashtags } = HashtagService

  return {
    // addEntities,
    // addHashtags,
    // addFoods,
    // addYelpBusinessEntities,
    postSocialEntry,
    suggestTags,
    // suggestYelp,
    toggleVisibility,
    updateDraftSocialEntry,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryInput)
