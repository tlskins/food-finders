import { default as BaseService } from '../base'

import actions from '@actions'


export default class FlashMessage extends BaseService {
  displaySuccessMessage( message ) {
    this.dispatch( actions.displayFlashMessage({ alertType: 'success', message }))
  }

  displayFailureMessage( message ) {
    this.dispatch( actions.displayFlashMessage({ alertType: 'fail', message }))
  }

  displayInfoMessage( message ) {
    this.dispatch( actions.displayFlashMessage({ alertType: 'info', message }))
  }

  dismissMessage( timestamp ) {
    this.dispatch( actions.dismissFlashMessage({ timestamp }))
  }

  dismissLastFlashMessage() {
    const { flashMessages } = this.getState().flashMessage
    const { timestamp } = flashMessages[flashMessages.length - 1]
    this.dispatch( actions.dismissFlashMessage({ timestamp }))
  }
}
