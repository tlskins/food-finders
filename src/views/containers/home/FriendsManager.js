import { connect } from 'react-redux'

import FriendsManager from '@components/home/FriendsManager'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'
import { HandleError } from '@coordinators/composed'


const mapStateToProps = state => {
  const { users } = state
  const { user } = state.session

  const followingCount = user ? user.followingCount : 0
  const followersCount = user ? user.followersCount : 0

  return {
    users,
    followingCount,
    followersCount,
  }
}

const mapDispatchToProps = () => {
  const { RestService, SessionService, UsersService } = services
  const { pResponseGeneric  } = presenters.Api
  const pResponseUser = pResponseGeneric
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
    updateUserRelationship
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsManager)
