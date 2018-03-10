import { connect } from 'react-redux'

import HierarchiesManager from '@components/hierarchiesManager/HierarchiesManager'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { hierarchies, session } = state
  const currentUser = session ? session.user : undefined


  return {
    currentUser,
    hierarchies,
  }
}

const mapDispatchToProps = () => {
  const { RouterService, HierarchiesService, RestService } = services
  const { pResponseGeneric: pResponseHierarchyTree } = presenters.Api

  const loadHierarchy = coordinators.loadHierarchy({ RestService, HierarchiesService, pResponseHierarchyTree })
  const redirect = () => RouterService.replace({ pathname: '/login' })

  return {
    loadHierarchy,
    redirect,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HierarchiesManager)
