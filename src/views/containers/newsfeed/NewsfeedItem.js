import { connect } from 'react-redux'

import NewsfeedItem from '@components/newsfeed/NewsfeedItem'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'

const mapStateToProps = state => {
  const { user } = state.session

  return { user }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(NewsfeedItem)
