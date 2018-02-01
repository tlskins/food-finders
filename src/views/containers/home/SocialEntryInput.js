import { connect } from 'react-redux'

import SocialEntryInput from '@components/home/SocialEntryInput'

import services from '@services'
import coordinators from '@coordinators'


const mapStateToProps = state => {
  const { entities } = state

  return {
    entities,
  }
}

const mapDispatchToProps = () => {
  const { RestService, EntityService } = services

  const loadDraftSocialEntry = coordinators.loadDraftSocialEntry({ RestService })
  const postSocialEntry = coordinators.postSocialEntry({ RestService })
  const suggestTags = coordinators.suggestTags({ RestService })
  const suggestYelp = coordinators.suggestYelp({ RestService })
  const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService })
  const { addEntities, addYelpBusinessEntities, searchEntitiesByName } = EntityService

  return {
    addEntities,
    addYelpBusinessEntities,
    loadDraftSocialEntry,
    postSocialEntry,
    searchEntitiesByName,
    suggestTags,
    suggestYelp,
    updateDraftSocialEntry,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryInput)
