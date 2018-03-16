import {
  ADD_FOOD_RATING_METRICS,
  EDIT_FOOD_RATING_METRIC,
  LOAD_FOOD_RATING_METRIC,
  RESET_FOOD_RATING_METRIC,
} from '@actions/foodRatingMetrics'


const editFoodRatingMetricInitialState = { edited: false }

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


export const editFoodRatingMetric = (state = { ...editFoodRatingMetricInitialState }, action) => {
  switch (action.type) {
    case LOAD_FOOD_RATING_METRIC: {
      return { ...action.foodRatingMetric, edited: false }
    }
    case EDIT_FOOD_RATING_METRIC: {
      return { ...action.foodRatingMetric, edited: true }
    }
    case RESET_FOOD_RATING_METRIC: {
      return { ...editFoodRatingMetricInitialState }
    }

    default:
      return state
  }
}
