import { default as BaseService } from '../base'

import actions from '@actions'


export default class SocialEntryDetailPanel extends BaseService {
  toggleMode( mode ) {
    this.dispatch( actions.socialEntryDetailPanelToggleMode( mode ))
  }
}
