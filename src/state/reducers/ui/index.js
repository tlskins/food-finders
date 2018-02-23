import * as loginFormUIReducers from './loginForm'
import * as flashMessageUIReducers from './flashMessage'
import * as friendsManagerUIReducers from './friendsManager'
import * as socialEntryUIReducers from './socialEntry'


export default {
  ...flashMessageUIReducers,
  ...friendsManagerUIReducers,
  ...loginFormUIReducers,
  ...socialEntryUIReducers,
}
