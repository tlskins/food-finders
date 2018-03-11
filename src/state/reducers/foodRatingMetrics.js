import {
  ADD_FOOD_RATING_METRICS,
  EDIT_FOOD_RATING_METRIC,
} from '@actions/foodRatingMetrics'


export const foodRatingMetrics = (state = {}, action) => {
  switch (action.type) {
    case ADD_FOOD_RATING_METRICS: {
      action.foodRatingMetrics.forEach( m => state[m.id] = m )

      return { ...state }
    }

    default:
      return state
  }
}


export const editFoodRatingMetric = (state = {}, action) => {
  switch (action.type) {
    case EDIT_FOOD_RATING_METRIC: {
      return { ...action.foodRatingMetric }
    }

    default:
      return state
  }
}
