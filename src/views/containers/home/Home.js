import { connect } from 'react-redux'

import Home from '@components/home/Home'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { actionables, session, friendsManager, socialEntryForm, home } = state
  const currentUser = session ? session.user : undefined
  const { actionablesDict } = actionables

  return {
    actionablesDict,
    currentUser,
    friendsManagerVisible: friendsManager.visible,
    socialEntryVisible: socialEntryForm.visible,
    home,
  }
}

const mapDispatchToProps = () => {
  const { RouterService, RestService, TagService, TaggablesService, UIService } = services
  const { pResponseGeneric, pTaggableClassToType, pResponseYelpBusiness } = presenters.Api
  const pResponseRoots = pResponseGeneric
  const pResponseTaggable = pResponseGeneric

  const toggleFriendsManagerVisibility = visible => UIService.FriendsManager.toggleVisibility(visible)
  const toggleSocialEntryVisibility = visible => UIService.SocialEntry.toggleVisibility(visible)
  const redirect = () => RouterService.replace({ pathname: '/login' })
  const loadRootTags = coordinators.LoadRootTags({ TagService, RestService, pResponseRoots })
  const loadTaggable = coordinators.LoadTaggable({ RestService, TaggablesService, pResponseTaggable, UIService, pResponseYelpBusiness })
  const displayInfoMessage = message => UIService.FlashMessage.displayInfoMessage(message)
  const toggleSocialEntryPage = newsfeedItem => UIService.Home.toggleSocialEntryPage(newsfeedItem)
  const toggleNewsfeed = () => UIService.Home.toggleNewsfeed()
  const selectNewsfeedItem = coordinators.SelectNewsfeedItem({ UIService, pTaggableClassToType, LoadTaggable: loadTaggable })

  return {
    displayInfoMessage,
    loadRootTags,
    loadTaggable,
    selectNewsfeedItem,
    toggleFriendsManagerVisibility,
    toggleNewsfeed,
    toggleSocialEntryPage,
    toggleSocialEntryVisibility,
    redirect,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
