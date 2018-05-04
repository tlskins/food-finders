import { connect } from 'react-redux'

import Newsfeed from '@components/newsfeed/Newsfeed'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'

const mapStateToProps = state => {
  const { actionables } = state
  const { newsfeed } = actionables

  return {
    newsfeed,
  }
}

const mapDispatchToProps = () => {
  const { RestService, SessionService, ActionablesService } = services
  const { pResponseFeedItems } = presenters.Api

  const loadNewsfeed = coordinators.loadNewsfeed({ RestService, SessionService, ActionablesService, pResponseFeedItems })

  return {
    loadNewsfeed,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Newsfeed)
