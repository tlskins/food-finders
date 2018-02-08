import Moment from 'moment'


export const DISPLAY_FLASH_MESSAGE = 'DISPLAY_FLASH_MESSAGE'
export const DISMISS_FLASH_MESSAGE = 'DISMISS_FLASH_MESSAGE'


export const displayFlashMessage = ({ alertType, message, options }) => {
  return {
    type: DISPLAY_FLASH_MESSAGE,
    alertType,
    message,
    options,
    timestamp: Moment().valueOf(),
  }
}


export const dismissFlashMessage = ({ timestamp }) => {
  return {
    type: DISMISS_FLASH_MESSAGE,
    timestamp,
  }
}
