import { connect } from 'react-redux'

import Newsfeed from '@components/home/Newsfeed'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'

const mapDispatchToProps = () => {
  const { RestService, SessionService } = services
  const { pResponseFeedItems } = presenters.Api

  const loadNewsfeed = coordinators.loadNewsfeed({ RestService, SessionService, pResponseFeedItems })

  return {
    loadNewsfeed,
  }
}

export default connect(null, mapDispatchToProps)(Newsfeed)
