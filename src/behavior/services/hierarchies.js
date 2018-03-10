import { default as BaseService } from './base'
import actions from '@actions'

export class HierarchiesService extends BaseService {
  addTree = (symbol, tree) => {
    this.dispatch( actions.addTree(symbol, tree) )
  }
}
