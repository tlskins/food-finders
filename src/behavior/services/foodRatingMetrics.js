import { default as BaseService } from './base'
import actions from '@actions'

export class FoodRatingMetricsService extends BaseService {
  addFoodRatingMetrics = foodRatingMetrics => {
    this.dispatch( actions.addFoodRatingMetrics(foodRatingMetrics) )
  }

  editFoodRatingMetric = foodRatingMetric => {
    this.dispatch( actions.editFoodRatingMetric(foodRatingMetric) )
  }
}
