import {
  camelCaseify,
} from '~/utils'


const _parseErrors = ({ errors, errorMessage, responseData }) => {
  const errors_ = camelCaseify( responseData )
  if ( typeof errors_ === 'object' ) {
    for ( const k in errors_ ) {
      if ( k === 'message' || k === 'error' ) {
        errorMessage = errors_[k]
      }
      else {
        errors[k] = errors_[k]
      }
    }
    if ( errorMessage === 'Unknown error' ) {
      errorMessage = 'Please check the errors below'
    }
  }
  else if ( typeof errors_ === 'string' ) {
    errorMessage = errors_
  }

  return {
    errors,
    errorMessage,
  }
}


export const responseErrorMessage = e => {
  let errors = {}
  let errorMessage = e.errorMessage || 'Unknown error'
  let responseData
  if ( e.response && e.response.data ) {
    responseData = e.response.data
  }
  else {
    responseData = e.response
  }

  return _parseErrors({ errors, errorMessage, responseData })
}
