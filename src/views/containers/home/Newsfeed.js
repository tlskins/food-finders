import { connect } from 'react-redux'

import Newsfeed from '@components/home/Newsfeed'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'

const mapDispatchToProps = () => {
  const { RestService, SessionService, UIService } = services
  const { pResponseGeneric: pResponseFeedItems } = presenters.Api

  const toggleVisibility = visible => UIService.SocialEntry.toggleVisibility(visible)
  const loadNewsfeed = coordinators.loadNewsfeed({ RestService, SessionService, pResponseFeedItems })

  return {
    loadNewsfeed,
    toggleVisibility,
  }
}

export default connect(null, mapDispatchToProps)(Newsfeed)
