import { default as BaseService } from '../base'

import actions from '@actions'


export default class TagEditor extends BaseService {
  toggleVisibility( visible ) {
    this.dispatch( actions.tagEditorToggleVisibility( visible ))
  }

  setTagSymbol( tagSymbol ) {
    this.dispatch( actions.tagEditorSetTagSymbol( tagSymbol ))
  }
}
