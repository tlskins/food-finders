import { default as BaseService } from './base'
import actions from '@actions'

export class YelpService extends BaseService {
  setYelpSuggestedLocations(json) {
    this.dispatch( actions.setYelpSuggestedLocations(json) )
  }
}
