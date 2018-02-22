import { default as BaseService } from '../base'

import actions from '@actions'


export default class FriendsManager extends BaseService {
  toggleVisibility( visible ) {
    this.dispatch( actions.friendsManagerToggleVisibility( visible ))
  }
}
