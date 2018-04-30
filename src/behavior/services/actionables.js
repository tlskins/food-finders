import { default as BaseService } from './base'
import actions from '@actions'

export class ActionablesService extends BaseService {
  loadNewsfeed = newsfeed => {
    this.dispatch( actions.loadNewsfeed(newsfeed) )
  }
}
