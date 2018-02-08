import {
  DISPLAY_FLASH_MESSAGE,
  DISMISS_FLASH_MESSAGE,
} from '@actions/ui/flashMessage'


const initialState = {
  flashMessages: [],
}


export const flashMessage = ( state = initialState, action ) => {
  switch( action.type ) {
  case DISPLAY_FLASH_MESSAGE: {
    const { alertType, message, options, timestamp } = action
    const flashMessages = state.flashMessages.slice()
    flashMessages.push({ alertType, message, options, timestamp })

    return { flashMessages }
  }
  case DISMISS_FLASH_MESSAGE: {
    const { timestamp } = action
    const flashMessages = state.flashMessages.filter( f => f.timestamp !== timestamp )

    return { flashMessages }
  }
  default:
    return state
  }
}
