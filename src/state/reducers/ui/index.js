import * as loginFormUIReducers from './loginForm'
import * as flashMessageUIReducers from './flashMessage'
import * as friendsManagerUIReducers from './friendsManager'
import * as socialEntryFormUIReducers from './socialEntryForm'
import * as tagEditorUIReducers from './tagEditor'
import * as hierarchiesManagerUIReducers from './hierarchiesManager'
import * as socialEntryDetailPanelUIReducers from './socialEntryDetailPanel'
import * as errorsReducers from './errors'
import * as homeReducers from './home'


export default {
  ...homeReducers,
  ...flashMessageUIReducers,
  ...friendsManagerUIReducers,
  ...loginFormUIReducers,
  ...socialEntryFormUIReducers,
  ...tagEditorUIReducers,
  ...hierarchiesManagerUIReducers,
  ...socialEntryDetailPanelUIReducers,
  ...errorsReducers,
}
