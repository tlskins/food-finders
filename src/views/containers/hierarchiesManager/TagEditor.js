import { connect } from 'react-redux'

import TagEditor from '@components/hierarchiesManager/TagEditor'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'
import { HandleError } from '@coordinators/composed'


const mapStateToProps = state => {
  const { editFoodRatingMetric, editTag, tagEditor, hierarchies } = state
  const { visible, tagSymbol } = tagEditor
  let tree = {}
  let dictionary = {}
  if ( hierarchies && tagSymbol ) {
    const hierarchy = Object.values(hierarchies).find( h => h.symbol === tagSymbol )
    tree = hierarchy && hierarchy.tree
    dictionary = hierarchy && hierarchy.dictionary
  }

  return {
    dictionary,
    tag: editTag,
    tagSymbol,
    tree,
    editedFoodRatingMetric: editFoodRatingMetric,
    visible,
  }
}

const mapDispatchToProps = () => {
  const { FoodRatingMetricsService, HierarchiesService, RestService, TagService, UIService } = services
  const { pResponseGeneric, pRequestTaggable, pResponseHierarchyTree } = presenters.Api
  const pResponseFoodRatingMetric = pResponseGeneric
  const pResponseTags = pResponseGeneric
  const pRequestFoodRatingMetric = pRequestTaggable

  const toggleVisibility = visible => UIService.TagEditor.toggleVisibility(visible)
  const setHierarchiesManagerStatus = status => UIService.HierarchiesManager.setHierarchiesManagerStatus(status)
  const resetHierarchiesManager = () => UIService.HierarchiesManager.resetHierarchiesManager()
  const updateFoodRatingMetric = (foodRatingMetric) => FoodRatingMetricsService.editFoodRatingMetric(foodRatingMetric)
  const loadFoodRatingMetricHierarchy = () => coordinators.LoadHierarchy({ RestService, HierarchiesService, pResponseHierarchyTree })('FoodRatingMetric')
  const editTag = coordinators.EditTag({ RestService, TagService, pResponseTags, UIService })
  const loadFoodRatingMetric = coordinators.LoadFoodRatingMetric({
    RestService,
    FoodRatingMetricsService,
    pResponseFoodRatingMetric,
    UIService
  })
  const saveFoodRatingMetric = coordinators.SaveFoodRatingMetric({
    RestService,
    LoadHierarchy: loadFoodRatingMetricHierarchy,
    FoodRatingMetricsService,
    pResponseFoodRatingMetric,
    pRequestFoodRatingMetric,
  })

  return {
    editTag,
    loadFoodRatingMetric,
    resetHierarchiesManager,
    saveFoodRatingMetric,
    setHierarchiesManagerStatus,
    toggleVisibility,
    updateFoodRatingMetric,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagEditor)
