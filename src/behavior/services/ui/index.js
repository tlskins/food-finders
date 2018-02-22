import { default as BaseService } from '../base'

import LoginForm from './loginForm'
import FlashMessage from './flashMessage'
import FriendsManager from './friendsManager'


const SubServices = {
  LoginForm,
  FlashMessage,
  FriendsManager,
}


export default class UIService extends BaseService {
  constructor( dispatch, getState ) {
    super( dispatch, getState )

    for ( const s in SubServices ) {
      this[s] = new SubServices[s]( dispatch, getState )
    }
    console.log('UIService this after constructor=',this)
  }
}
