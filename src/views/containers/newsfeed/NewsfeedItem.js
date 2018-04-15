import { connect } from 'react-redux'

import NewsfeedItem from '@components/newsfeed/NewsfeedItem'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'

const mapDispatchToProps = () => {
  const { RestService, SessionService, SocialEntryService, UIService } = services
  const { pResponseUser, pRequestUpdateSocialEntry } = presenters.Api

  const newReplySocialEntry = coordinators.newReplySocialEntry({
    RestService,
    SessionService,
    UIService,
    SocialEntryService,
    pResponseUser,
    pRequestUpdateSocialEntry,
  })

  return {
    newReplySocialEntry,
  }
}

export default connect(null, mapDispatchToProps)(NewsfeedItem)
