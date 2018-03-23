import { connect } from 'react-redux'

import Home from '@components/home/Home'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { session, friendsManager, socialEntry } = state
  const currentUser = session ? session.user : undefined

  return {
    currentUser,
    friendsManagerVisible: friendsManager.visible,
    socialEntryVisible: socialEntry.visible,
  }
}

const mapDispatchToProps = () => {
  const { RouterService, RestService, TagService, UIService } = services
  const { pResponseGeneric } = presenters.Api
  const pResponseRoots = pResponseGeneric

  const toggleFriendsManagerVisibility = visible => UIService.FriendsManager.toggleVisibility(visible)
  const toggleSocialEntryVisibility = visible => UIService.SocialEntry.toggleVisibility(visible)
  const redirect = () => RouterService.replace({ pathname: '/login' })
  const loadRootTags = coordinators.loadRootTags({ TagService, RestService, pResponseRoots })

  return {
    loadRootTags,
    toggleFriendsManagerVisibility,
    toggleSocialEntryVisibility,
    redirect,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
