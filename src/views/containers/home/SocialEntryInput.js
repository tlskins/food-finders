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
  const { RestService, EntityService, FoodService, HashtagService } = services

  const loadDraftSocialEntry = coordinators.loadDraftSocialEntry({ RestService })
  const postSocialEntry = coordinators.postSocialEntry({ RestService })
  const suggestTags = coordinators.suggestTags({ RestService })
  const suggestYelp = coordinators.suggestYelp({ RestService })
  const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService })
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
