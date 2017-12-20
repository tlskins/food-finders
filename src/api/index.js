import axios from './axios'
import * as restApi from './rest'


// REST client for Hungry API
export default Object.freeze({
  axios,
  ...restApi,
})
