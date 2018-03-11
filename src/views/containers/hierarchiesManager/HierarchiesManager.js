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
  const { FoodRatingMetricsService, RouterService, HierarchiesService, RestService, UIService } = services
  const { pResponseGeneric } = presenters.Api
  const pResponseHierarchyTree = pResponseGeneric
  const pResponseFoodRatingMetric = pResponseGeneric

  const loadHierarchy = coordinators.loadHierarchy({ RestService, HierarchiesService, pResponseHierarchyTree })
  const redirect = () => RouterService.replace({ pathname: '/login' })
  const editFoodRatingMetric = coordinators.EditFoodRatingMetric({
    RestService,
    FoodRatingMetricsService,
    pResponseFoodRatingMetric,
    UIService
  })

  return {
    editFoodRatingMetric,
    loadHierarchy,
    redirect,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HierarchiesManager)
