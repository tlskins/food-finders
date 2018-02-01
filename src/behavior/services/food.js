import { default as BaseService } from './base'
import actions from '@actions'

export class FoodService extends BaseService {
  addFoods = foods => {
    this.dispatch( actions.addFoods(foods) )
  }
}
