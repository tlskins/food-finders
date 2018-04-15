import { connect } from 'react-redux'

import Newsfeed from '@components/newsfeed/Newsfeed'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'

const mapDispatchToProps = () => {
  const { RestService, SessionService, UIService } = services
  const { pResponseFeedItems } = presenters.Api

  const loadNewsfeed = coordinators.loadNewsfeed({ RestService, SessionService, pResponseFeedItems })
  const selectNewsfeedItem = selectedItem => UIService.Newsfeed.selectNewsfeedItem(selectedItem)

  return {
    loadNewsfeed,
    selectNewsfeedItem,
  }
}

export default connect(null, mapDispatchToProps)(Newsfeed)
