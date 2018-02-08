import { default as BaseService } from '../base'

import LoginForm from './loginForm'
import FlashMessage from './flashMessage'


const SubServices = {
  FlashMessage,
  LoginForm,
}


export default class UIService extends BaseService {
  constructor( dispatch, getState ) {
    super( dispatch, getState )

    for ( const s in SubServices ) {
      this[s] = new SubServices[s]( dispatch, getState )
    }
  }
}
