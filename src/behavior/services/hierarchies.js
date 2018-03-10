import { default as BaseService } from './base'
import actions from '@actions'

export class HierarchiesService extends BaseService {
  addTree = (className, tree) => {
    this.dispatch( actions.addTree(className, tree) )
  }
}
