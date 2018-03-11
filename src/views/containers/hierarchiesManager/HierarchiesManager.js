import { connect } from 'react-redux'

import HierarchiesManager from '@components/hierarchiesManager/HierarchiesManager'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { hierarchies, session, tagEditor } = state
  const { visible } = tagEditor
  const currentUser = session ? session.user : undefined


  return {
    currentUser,
    hierarchies,
    visible,
  }
}

const mapDispatchToProps = () => {
  const { RouterService, HierarchiesService, RestService, TagService, UIService } = services
  const { pResponseGeneric } = presenters.Api
  const pResponseHierarchyTree = pResponseGeneric
  const pResponseTags = pResponseGeneric
  const pResponseYelpBusinesses = pResponseGeneric

  const loadHierarchy = coordinators.loadHierarchy({ RestService, HierarchiesService, pResponseHierarchyTree })
  const redirect = () => RouterService.replace({ pathname: '/login' })
  const editTag = coordinators.EditTag({ RestService, TagService, pResponseTags, pResponseYelpBusinesses, UIService })

  return {
    loadHierarchy,
    redirect,
    editTag,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HierarchiesManager)
