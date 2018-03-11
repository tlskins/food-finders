
export const EditFoodRatingMetric = ({ RestService, FoodRatingMetricsService, pResponseFoodRatingMetric, UIService }) => async id => {
  const { foodRatingMetrics } = FoodRatingMetricsService.getState()
  const foodRatingMetric = foodRatingMetrics[id]
  if ( foodRatingMetric ) {
    FoodRatingMetricsService.editFoodRatingMetric(foodRatingMetric)
    UIService.TagEditor.toggleVisibility(true)
  }
  else {
    const response = await RestService.get(`food_rating_metrics/${ id }`)
    const foodRatingMetric = pResponseFoodRatingMetric(response)
    FoodRatingMetricsService.addFoodRatingMetrics([foodRatingMetric])
    FoodRatingMetricsService.editFoodRatingMetric(foodRatingMetric)
    UIService.TagEditor.toggleVisibility(true)
  }
}
