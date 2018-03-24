import * as loginFormUIReducers from './loginForm'
import * as flashMessageUIReducers from './flashMessage'
import * as friendsManagerUIReducers from './friendsManager'
import * as socialEntryUIReducers from './socialEntry'
import * as tagEditorUIReducers from './tagEditor'
import * as hierarchiesManagerUIReducers from './hierarchiesManager'
import * as newsfeedUIReducers from './newsfeed'


export default {
  ...flashMessageUIReducers,
  ...friendsManagerUIReducers,
  ...loginFormUIReducers,
  ...socialEntryUIReducers,
  ...tagEditorUIReducers,
  ...hierarchiesManagerUIReducers,
  ...newsfeedUIReducers,
}
