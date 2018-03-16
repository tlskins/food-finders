import { connect } from 'react-redux'

import HierarchiesManager from '@components/hierarchiesManager/HierarchiesManager'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { editFoodRatingMetric, hierarchies, hierarchiesManager, session, tagEditor } = state
  const { visible } = tagEditor
  const currentUser = session ? session.user : undefined
  const { status } = hierarchiesManager
  const edited = editFoodRatingMetric && editFoodRatingMetric.edited

  return {
    edited,
    editedFoodRatingMetric: editFoodRatingMetric,
    currentUser,
    hierarchies,
    hierarchiesManager,
    status,
    visible,
  }
}

const mapDispatchToProps = () => {
  const {
    FoodRatingMetricsService,
    RouterService,
    TagService,
    HierarchiesService,
    RestService,
    UIService,
  } = services
  const { pResponseGeneric, pResponseHierarchyTree } = presenters.Api
  const pResponseTags = pResponseGeneric
  const pResponseFoodRatingMetric = pResponseGeneric

  const loadHierarchy = coordinators.LoadHierarchy({ RestService, HierarchiesService, pResponseHierarchyTree })
  const toggleTagEditorVisibility = visible => UIService.TagEditor.toggleVisibility(visible)
  const redirect = () => RouterService.replace({ pathname: '/login' })
  const setHierarchiesManagerStatus = status => UIService.HierarchiesManager.setHierarchiesManagerStatus(status)
  const resetFoodRatingMetric = () => FoodRatingMetricsService.resetFoodRatingMetric()
  const setTagEditorTagSymbol = (tagSymbol) => UIService.TagEditor.setTagSymbol(tagSymbol)
  const editTag = coordinators.EditTag({ RestService, TagService, pResponseTags, UIService })
  const loadFoodRatingMetric = coordinators.LoadFoodRatingMetric({
    RestService,
    FoodRatingMetricsService,
    pResponseFoodRatingMetric,
    UIService
  })
  const updateFoodRatingMetric = (foodRatingMetric) => FoodRatingMetricsService.editFoodRatingMetric(foodRatingMetric)

  return {
    editTag,
    loadFoodRatingMetric,
    loadHierarchy,
    redirect,
    resetFoodRatingMetric,
    setHierarchiesManagerStatus,
    setTagEditorTagSymbol,
    toggleTagEditorVisibility,
    updateFoodRatingMetric,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HierarchiesManager)
