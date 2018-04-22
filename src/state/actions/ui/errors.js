export const CLEAR_ERRORS = 'CLEAR_ERRORS'
export const SHOW_ERROR_ALERT = 'SHOW_ERROR_ALERT'
export const UPDATE_ERRORS = 'UPDATE_ERRORS'


export const clearErrors = () => ({ type: CLEAR_ERRORS })


export const updateErrors = ({ errors, namespace }) => ({ type: UPDATE_ERRORS, errors, namespace })
