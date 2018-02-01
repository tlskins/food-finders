import { default as BaseService } from './base'
import actions from '@actions'

export class EntityService extends BaseService {
  addEntities = entities => {
    this.dispatch( actions.addEntities(entities) )
  }

  addYelpBusinessEntities = businesses => {
    this.dispatch( actions.addYelpBusinessEntities(businesses) )
  }

  searchEntitiesByName = text => {
    this.dispatch( actions.searchEntitiesByName(text) )
  }
}
