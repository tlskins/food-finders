import axios from './axios'
import * as restApi from './rest'


// REST client for API
export default Object.freeze({
  axios,
  ...restApi,
})
