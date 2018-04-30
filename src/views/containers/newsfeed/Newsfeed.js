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
  const { RestService, SessionService, UIService, ActionablesService } = services
  const { pResponseFeedItems } = presenters.Api

  const loadNewsfeed = coordinators.loadNewsfeed({ RestService, SessionService, ActionablesService, pResponseFeedItems })
  const selectNewsfeedItem = selectedItem => UIService.Newsfeed.selectNewsfeedItem(selectedItem)

  return {
    loadNewsfeed,
    selectNewsfeedItem,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Newsfeed)
