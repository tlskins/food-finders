import * as loginFormUIReducers from './loginForm'
import * as flashMessageUIReducers from './flashMessage'
import * as friendsManagerUIReducers from './friendsManager'
import * as socialEntryFormUIReducers from './socialEntryForm'
import * as tagEditorUIReducers from './tagEditor'
import * as hierarchiesManagerUIReducers from './hierarchiesManager'
import * as newsfeedUIReducers from './newsfeed'
import * as socialEntryDetailPanelUIReducers from './socialEntryDetailPanel'
import * as errorsReducers from './errors'


export default {
  ...flashMessageUIReducers,
  ...friendsManagerUIReducers,
  ...loginFormUIReducers,
  ...socialEntryFormUIReducers,
  ...tagEditorUIReducers,
  ...hierarchiesManagerUIReducers,
  ...newsfeedUIReducers,
  ...socialEntryDetailPanelUIReducers,
  ...errorsReducers,
}
