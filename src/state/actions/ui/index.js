import * as loginFormUIActions from './loginForm'
import * as flashMessageUIActions from './flashMessage'
import * as friendsManagerUIActions from './friendsManager'
import * as socialEntryUiActions from './socialEntry'
import * as tagEditorUIActions from './tagEditor'
import * as hierarchiesManagerUIActions from './hierarchiesManager'
import * as socialEntryDetailPanelUIActions from './socialEntryDetailPanel'
import * as errorsActions from './errors'


export default {
  ...loginFormUIActions,
  ...flashMessageUIActions,
  ...friendsManagerUIActions,
  ...socialEntryUiActions,
  ...tagEditorUIActions,
  ...hierarchiesManagerUIActions,
  ...socialEntryDetailPanelUIActions,
  ...errorsActions,
}
