import { connect } from 'react-redux'

import EntitySearchPanel from '@components/common/EntitySearchPanel'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
}

const mapDispatchToProps = () => {
  const { RestService, SocialEntryService, SessionService, TaggablesService, UIService } = services
  const { pResponseUser, pResponseYelpBusinesses, pRequestUpdateSocialEntry } = presenters.Api
  const UpdateDraftSocialEntry = coordinators.updateDraftSocialEntry({
    RestService,
    SessionService,
    SocialEntryService,
    pResponseUser,
    pRequestUpdateSocialEntry,
  })

  const searchYelpBusinesses = coordinators.SearchYelpBusinesses({ RestService, pResponseYelpBusinesses })
  const addTagToText = coordinators.addTagToText({ SocialEntryService, UpdateDraftSocialEntry, TaggablesService })
  const toggleMode = mode => UIService.SocialEntryDetailPanel.toggleMode(mode)

  return {
    addTagToText,
    searchYelpBusinesses,
    toggleMode,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySearchPanel)
