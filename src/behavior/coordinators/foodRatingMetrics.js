
export const LoadFoodRatingMetric = ({ RestService, FoodRatingMetricsService, pResponseFoodRatingMetric, UIService }) => async id => {
  const { foodRatingMetrics } = FoodRatingMetricsService.getState()
  const foodRatingMetric = foodRatingMetrics[id]
  if ( foodRatingMetric ) {
    FoodRatingMetricsService.loadFoodRatingMetric(foodRatingMetric)
    UIService.TagEditor.toggleVisibility(true)
  }
  else {
    const response = await RestService.get(`/api/food_rating_metrics/${ id }`)
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
  pRequestFoodRatingMetric,
  HandleError,
}) => async json => {
    const { id } = json
    const params = { food_rating_metric: pRequestFoodRatingMetric(json) }

    try {
      let response = undefined
      if ( id ) {
        response = await RestService.put(`/api/food_rating_metrics/${ id }`, params)
      }
      else {
        response = await RestService.post(`/api/food_rating_metrics/`, params)
      }
      const foodRatingMetric = pResponseFoodRatingMetric(response)
      FoodRatingMetricsService.addFoodRatingMetrics([foodRatingMetric])
      FoodRatingMetricsService.editFoodRatingMetric(foodRatingMetric)
      LoadHierarchy()
    }
    catch ( error ) {
      HandleError({ error, namespace: 'foodRatingMetric'})
    }
}
