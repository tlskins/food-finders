import * as loginFormUIReducers from './loginForm'
import * as flashMessageUIReducers from './flashMessage'


export default {
  ...flashMessageUIReducers,
  ...loginFormUIReducers,
}
