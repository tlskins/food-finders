
export const LoadFoodRatingMetric = ({ RestService, FoodRatingMetricsService, pResponseFoodRatingMetric, UIService }) => async id => {
  const { foodRatingMetrics } = FoodRatingMetricsService.getState()
  const foodRatingMetric = foodRatingMetrics[id]
  if ( foodRatingMetric ) {
    FoodRatingMetricsService.loadFoodRatingMetric(foodRatingMetric)
    UIService.TagEditor.toggleVisibility(true)
  }
  else {
    const response = await RestService.get(`food_rating_metrics/${ id }`)
    const foodRatingMetric = pResponseFoodRatingMetric(response)
    FoodRatingMetricsService.addFoodRatingMetrics([foodRatingMetric])
    FoodRatingMetricsService.loadFoodRatingMetric(foodRatingMetric)
    UIService.TagEditor.toggleVisibility(true)
  }
}


export const SaveFoodRatingMetric = ({
  RestService,
  LoadHierarchy,
  FoodRatingMetricsService,
  pResponseFoodRatingMetric,
  pRequestFoodRatingMetric
}) => async json => {
    const { id } = json
    const params = { food_rating_metric: pRequestFoodRatingMetric(json) }
    const response = await RestService.put(`food_rating_metrics/${ id }`, params)
    const foodRatingMetric = pResponseFoodRatingMetric(response)
    FoodRatingMetricsService.addFoodRatingMetrics([foodRatingMetric])
    FoodRatingMetricsService.editFoodRatingMetric(foodRatingMetric)
    LoadHierarchy()
}
