import { connect } from 'react-redux'

import FriendsManager from '@components/home/FriendsManager'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'
import { HandleError } from '@coordinators/composed'


const mapStateToProps = state => {
  const { users, friendsManager } = state
  const { user } = state.session
  const { visible } = friendsManager

  const followingCount = user ? user.followingCount : 0
  const followersCount = user ? user.followersCount : 0

  return {
    followingCount,
    followersCount,
    visible,
    users,
  }
}

const mapDispatchToProps = () => {
  const { RestService, SessionService, UIService, UsersService } = services

  const toggleVisibility = visible => UIService.FriendsManager.toggleVisibility(visible)
  const { pResponseGeneric, pResponseUser  } = presenters.Api
  const pResponseUsers = pResponseGeneric
  const pResponseRelationships = pResponseGeneric

  const searchUsersByText = coordinators.searchUsersByText({
    RestService,
    UsersService,
    SessionService,
    pResponseUsers,
    pResponseRelationships,
    HandleError
  })
  const updateUserRelationship = coordinators.updateUserRelationship({
    RestService,
    SessionService,
    UsersService,
    pResponseUser,
    HandleError
  })

  return {
    searchUsersByText,
    toggleVisibility,
    updateUserRelationship
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsManager)
