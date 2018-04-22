import { HandleError as HandleError_ } from './errors'
import services from '@services'
import presenters from '@presenters'


const { UIService } = services
const pResponseError = presenters.Errors.responseErrorMessage

export const HandleError = HandleError_({ UIService, pResponseError })
