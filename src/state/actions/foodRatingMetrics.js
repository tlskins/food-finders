export const ADD_FOOD_RATING_METRICS = 'ADD_FOOD_RATING_METRICS'

export const EDIT_FOOD_RATING_METRIC = 'EDIT_FOOD_RATING_METRIC'

export const LOAD_FOOD_RATING_METRIC = 'LOAD_FOOD_RATING_METRIC'

export const RESET_FOOD_RATING_METRIC = 'RESET_FOOD_RATING_METRIC'



export const addFoodRatingMetrics = foodRatingMetrics => ({ type: ADD_FOOD_RATING_METRICS, foodRatingMetrics })

export const editFoodRatingMetric = foodRatingMetric => ({ type: EDIT_FOOD_RATING_METRIC, foodRatingMetric })

export const loadFoodRatingMetric = foodRatingMetric => ({ type: LOAD_FOOD_RATING_METRIC, foodRatingMetric })

export const resetFoodRatingMetric = () => ({ type: RESET_FOOD_RATING_METRIC })
