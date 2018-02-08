import { default as BaseService } from './base'
import actions from '@actions'


export class SessionService extends BaseService {
  async setUserSession( user ) {
    this.dispatch( actions.setUserSession( user ))
  }

  async clearUserSession() {
    this.dispatch( actions.clearUserSession())
  }

  async refreshSession() {
    this.dispatch( actions.refreshSession())
  }
}
