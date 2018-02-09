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
  const pResponseUsers = pResponseGeneric
  const pResponseRelationships = pResponseGeneric

  const SearchUsersByText = coordinators.searchUsersByText({
    RestService,
    UsersService,
    SessionService,
    pResponseUsers,
    pResponseRelationships,
    HandleError
  })

  return {
    SearchUsersByText,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsManager)
