import { connect } from 'react-redux'

import Home from '@components/home/Home'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { session, friendsManager, newsfeed, socialEntryForm } = state
  const currentUser = session ? session.user : undefined
  const { selectedItem } = newsfeed

  return {
    currentUser,
    friendsManagerVisible: friendsManager.visible,
    selectedNewsfeedItem: selectedItem,
    socialEntryVisible: socialEntryForm.visible,
  }
}

const mapDispatchToProps = () => {
  const { RouterService, RestService, TagService, TaggablesService, UIService } = services
  const { pResponseGeneric, pTaggableClassToType } = presenters.Api
  const pResponseRoots = pResponseGeneric
  const pResponseTaggable = pResponseGeneric

  const toggleFriendsManagerVisibility = visible => UIService.FriendsManager.toggleVisibility(visible)
  const toggleSocialEntryVisibility = visible => UIService.SocialEntry.toggleVisibility(visible)
  const redirect = () => RouterService.replace({ pathname: '/login' })
  const loadRootTags = coordinators.LoadRootTags({ TagService, RestService, pResponseRoots })
  const loadTaggable = coordinators.LoadTaggable({ RestService, TaggablesService, pResponseTaggable, UIService })
  const displayInfoMessage = message => UIService.FlashMessage.displayInfoMessage(message)

  return {
    displayInfoMessage,
    loadRootTags,
    loadTaggable,
    pTaggableClassToType,
    toggleFriendsManagerVisibility,
    toggleSocialEntryVisibility,
    redirect,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
