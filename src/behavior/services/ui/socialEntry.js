import { default as BaseService } from '../base'

import actions from '@actions'


export default class SocialEntry extends BaseService {
  toggleVisibility( visible ) {
    this.dispatch( actions.toggleSocialEntryModal( visible ))
  }

  setCursorTextData({
    cursorBeginIndex,
    cursorEndIndex,
    tagSymbol,
    searchText,
  }) {
    this.dispatch( actions.setCursorTextData({
      cursorBeginIndex,
      cursorEndIndex,
      tagSymbol,
      searchText,
    }) )
  }
}
