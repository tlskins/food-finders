import { connect } from 'react-redux'

import EntitySearchPanel from '@components/common/EntitySearchPanel'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  // const { session, socialEntry, tags, tagSearches } = state
  // const { requestedAt, user } = session
  // const { visible } = socialEntry
  //
  // const draftSocialEntry = user ? user.draftSocialEntry : ''
  //
  // return {
  //   draftSocialEntry,
  //   tags,
  //   tagSearches,
  //   user,
  //   requestedAt,
  //   visible,
  // }
}

const mapDispatchToProps = () => {
  const { RestService } = services
  const { pResponseYelpBusinesses } = presenters.Api
  const searchYelpBusinesses = coordinators.SearchYelpBusinesses({ RestService, pResponseYelpBusinesses })

  return {
    searchYelpBusinesses,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySearchPanel)
