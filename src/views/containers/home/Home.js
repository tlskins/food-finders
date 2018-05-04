import { connect } from 'react-redux'

import Home from '@components/home/Home'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { actionables, session, friendsManager, socialEntryForm } = state
  const currentUser = session ? session.user : undefined
  const { actionablesDict } = actionables

  return {
    actionablesDict,
    currentUser,
    friendsManagerVisible: friendsManager.visible,
    socialEntryVisible: socialEntryForm.visible,
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
