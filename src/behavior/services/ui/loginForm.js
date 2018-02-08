import { default as BaseService } from '../base'

import actions from '@actions'


export default class LoginForm extends BaseService {
  toggleMode( mode ) {
    this.dispatch( actions.loginFormToggleMode( mode ))
  }
}
