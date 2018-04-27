import { default as BaseService } from './base'
import actions from '@actions'


export class SessionService extends BaseService {
  setUserSession( user, requestedAt ) {
    this.dispatch( actions.setUserSession( user, requestedAt ))
  }

  clearUserSession() {
    this.dispatch( actions.clearUserSession())
  }

  refreshSession() {
    this.dispatch( actions.refreshSession())
  }

  currentUser() {
    const currentUser = this.getState().session.user
    if ( !currentUser || !currentUser.id ) {
      return undefined
    }
    else {
      return currentUser
    }
  }

  currentUserId() {
    const currentUser = this.currentUser()

    if ( currentUser ) {
      return currentUser.id
    }
    else {
      return null
    }
  }
}
