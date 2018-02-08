import { connect } from 'react-redux'

import SocialEntryInput from '@components/home/SocialEntryInput'

import services from '@services'
import coordinators from '@coordinators'


const mapStateToProps = state => {
  const { entities, foods, hashtags } = state

  return {
    entities,
    foods,
    hashtags,
  }
}

const mapDispatchToProps = () => {
  const { RestService, EntityService, FoodService, HashtagService, SessionService } = services

  const loadDraftSocialEntry = coordinators.loadDraftSocialEntry({ RestService, SessionService })
  const postSocialEntry = coordinators.postSocialEntry({ RestService, SessionService })
  const suggestTags = coordinators.suggestTags({ RestService })
  const suggestYelp = coordinators.suggestYelp({ RestService })
  const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService, SessionService })
  const { addEntities, addYelpBusinessEntities } = EntityService
  const { addFoods } = FoodService
  const { addHashtags } = HashtagService

  return {
    addEntities,
    addHashtags,
    addFoods,
    addYelpBusinessEntities,
    loadDraftSocialEntry,
    postSocialEntry,
    suggestTags,
    suggestYelp,
    updateDraftSocialEntry,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryInput)
