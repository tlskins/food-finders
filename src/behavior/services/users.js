import { default as BaseService } from './base'
import actions from '@actions'


export class UsersService extends BaseService {
  addUsers = users => {
    this.dispatch( actions.addUsers(users) )
  }
  addUserRelationships = relationships => {
    this.dispatch( actions.addUserRelationships(relationships) )
  }
}
