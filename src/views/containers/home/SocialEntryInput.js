import { connect } from 'react-redux'

import SocialEntryInput from '@components/home/SocialEntryInput'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { entities, foods, hashtags, session } = state
  const { user } = session

  const draftSocialEntry = user ? user.draftSocialEntry : ''

  return {
    draftSocialEntry,
    entities,
    foods,
    hashtags,
  }
}

const mapDispatchToProps = () => {
  const { RestService, EntityService, FoodService, HashtagService, SessionService } = services
  const { pResponseGeneric, pResponseYelpBusinesses } = presenters.Api
  const pResponseUser = pResponseGeneric
  const pResponseTags = pResponseGeneric

  const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService, SessionService, pResponseUser })
  const postSocialEntry = coordinators.postSocialEntry({ RestService, SessionService, pResponseUser })
  const suggestTags = coordinators.suggestTags({ RestService, pResponseTags })
  const suggestYelp = coordinators.suggestYelp({ RestService, pResponseYelpBusinesses })
  const { addEntities, addYelpBusinessEntities } = EntityService
  const { addFoods } = FoodService
  const { addHashtags } = HashtagService

  return {
    addEntities,
    addHashtags,
    addFoods,
    addYelpBusinessEntities,
    postSocialEntry,
    suggestTags,
    suggestYelp,
    updateDraftSocialEntry,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryInput)
