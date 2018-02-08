import { connect } from 'react-redux'

import Newsfeed from '@components/home/Newsfeed'

import services from '@services'
import coordinators from '@coordinators'

const mapDispatchToProps = () => {
  const { RestService, SessionService } = services

  const loadNewsfeed = coordinators.loadNewsfeed({ RestService, SessionService })

  return {
    loadNewsfeed,
  }
}

export default connect(null, mapDispatchToProps)(Newsfeed)
