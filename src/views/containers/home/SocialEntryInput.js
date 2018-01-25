import { connect } from 'react-redux'

import SocialEntryInput from '@components/home/SocialEntryInput'

import services from '@services'
import coordinators from '@coordinators'

const mapDispatchToProps = () => {
  const { RestService } = services

  const loadDraftSocialEntry = coordinators.loadDraftSocialEntry({ RestService })
  const updateDraftSocialEntry = coordinators.updateDraftSocialEntry({ RestService })

  return {
    loadDraftSocialEntry,
    updateDraftSocialEntry,
  }
}

export default connect(null, mapDispatchToProps)(SocialEntryInput)
