import { connect } from 'react-redux'

import TagEditor from '@components/hierarchiesManager/TagEditor'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'
import { HandleError } from '@coordinators/composed'


const mapStateToProps = state => {
  const { editFoodRatingMetric, tagEditor } = state
  const { visible } = tagEditor

  return {
    editedFoodRatingMetric: editFoodRatingMetric,
    visible,
  }
}

const mapDispatchToProps = () => {
  const { FoodRatingMetricsService, RestService, UIService } = services
  const { pResponseGeneric } = presenters.Api
  const pResponseFoodRatingMetric = pResponseGeneric

  const toggleVisibility = visible => UIService.TagEditor.toggleVisibility(visible)
  const editFoodRatingMetric = coordinators.EditFoodRatingMetric({
    RestService,
    FoodRatingMetricsService,
    pResponseFoodRatingMetric,
    UIService
  })

  return {
    editFoodRatingMetric,
    toggleVisibility,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagEditor)
