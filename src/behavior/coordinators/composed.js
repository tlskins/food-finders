import { HandleError as HandleError_ } from './errors'
import services from '@services'


const { UIService } = services


export const HandleError = HandleError_({ UIService })
