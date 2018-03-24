import * as loginFormUIActions from './loginForm'
import * as flashMessageUIActions from './flashMessage'
import * as friendsManagerUIActions from './friendsManager'
import * as socialEntryUiActions from './socialEntry'
import * as tagEditorUIActions from './tagEditor'
import * as hierarchiesManagerUIActions from './hierarchiesManager'
import * as newsfeedUIActions from './newsfeed'


export default {
  ...loginFormUIActions,
  ...flashMessageUIActions,
  ...friendsManagerUIActions,
  ...socialEntryUiActions,
  ...tagEditorUIActions,
  ...hierarchiesManagerUIActions,
  ...newsfeedUIActions,
}
