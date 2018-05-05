import { default as BaseService } from './base'
import actions from '@actions'

export class ActionablesService extends BaseService {
  loadNewsfeed = newsfeed => {
    this.dispatch( actions.loadNewsfeed(newsfeed) )
  }

  findActionable = actionableId => {
    const dict = this.getState().actionables.actionablesDict
    return dict[actionableId]
  }

  loadActionable = actionable => {
    this.dispatch( actions.loadActionable(actionable) )
  }
}
