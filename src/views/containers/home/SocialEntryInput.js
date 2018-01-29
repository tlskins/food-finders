import { connect } from 'react-redux'

import SocialEntryInput from '@components/home/SocialEntryInput'

import services from '@services'
import coordinators from '@coordinators'

const mapDispatchToProps = () => {
  const { RestService } = services

  const loadDraftSocialEntry = coordinators.loadDraftSocialEntry({ RestService })
  const postSocialEntry = coordinators.postSocialEntry({ RestService })
  const suggestTags = coordinators.suggestTags({ RestService })
  const suggestYelp = coordinators.suggestYelp({ RestService })
  const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService })

  return {
    loadDraftSocialEntry,
    postSocialEntry,
    suggestTags,
    suggestYelp,
    updateDraftSocialEntry,
  }
}

export default connect(null, mapDispatchToProps)(SocialEntryInput)
