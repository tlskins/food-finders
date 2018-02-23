import * as loginFormUIActions from './loginForm'
import * as flashMessageUIActions from './flashMessage'
import * as friendsManagerUIActions from './friendsManager'
import * as socialEntryUiActions from './socialEntry'

export default {
  ...loginFormUIActions,
  ...flashMessageUIActions,
  ...friendsManagerUIActions,
  ...socialEntryUiActions,
}
