import { connect } from 'react-redux'

import TagEditor from '@components/hierarchiesManager/TagEditor'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'
import { HandleError } from '@coordinators/composed'


const mapStateToProps = state => {
  const { editTag, tags, tagEditor } = state
  // const { user } = state.session
  const { visible } = tagEditor
  //
  // const followingCount = user ? user.followingCount : 0
  // const followersCount = user ? user.followersCount : 0
  //
  return {
    // followingCount,
    // followersCount,
    editTag,
    tags,
    visible,
    // users,
  }
}

const mapDispatchToProps = () => {
  const { RestService, TagService, UIService } = services
  const { pResponseGeneric, pResponseYelpBusinesses } = presenters.Api
  const pResponseTags = pResponseGeneric

  const toggleVisibility = visible => UIService.TagEditor.toggleVisibility(visible)
  // const { pResponseGeneric  } = presenters.Api
  // const pResponseUser = pResponseGeneric
  // const pResponseUsers = pResponseGeneric
  // const pResponseRelationships = pResponseGeneric
  const updateTag = coordinators.EditTag({ RestService, TagService, pResponseTags, pResponseYelpBusinesses, UIService })
  // const searchUsersByText = coordinators.searchUsersByText({
  //   RestService,
  //   UsersService,
  //   SessionService,
  //   pResponseUsers,
  //   pResponseRelationships,
  //   HandleError
  // })
  // const updateUserRelationship = coordinators.updateUserRelationship({
  //   RestService,
  //   SessionService,
  //   UsersService,
  //   pResponseUser,
  //   HandleError
  // })
  //
  return {
    updateTag,
    toggleVisibility,
    // updateUserRelationship
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagEditor)
