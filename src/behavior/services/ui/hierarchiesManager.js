import { default as BaseService } from '../base'

import actions from '@actions'


export default class HierarchiesManager extends BaseService {
  setHierarchiesManagerLocked( locked ) {
    this.dispatch( actions.setHierarchiesManagerLocked( locked ))
  }

  setHierarchiesManagerStatus( status ) {
    this.dispatch( actions.setHierarchiesManagerStatus( status ))
  }

  resetHierarchiesManager() {
    this.dispatch( actions.resetHierarchiesManager())
  }
}
