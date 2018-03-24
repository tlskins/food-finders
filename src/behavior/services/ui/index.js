import { default as BaseService } from '../base'

import LoginForm from './loginForm'
import FlashMessage from './flashMessage'
import FriendsManager from './friendsManager'
import SocialEntry from './socialEntry'
import TagEditor from './tagEditor'
import HierarchiesManager from './hierarchiesManager'
import Newsfeed from './newsfeed'


const SubServices = {
  LoginForm,
  FlashMessage,
  FriendsManager,
  SocialEntry,
  TagEditor,
  HierarchiesManager,
  Newsfeed,
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
