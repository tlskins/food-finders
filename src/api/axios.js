import Axios from 'axios'
import config from '../config'


export default (() => {
  // A preconfigured axios instance
  // Using this instead of global axios prevents conflicts with other node modules
  const instance = Axios.create({
    baseURL: config.API_HOST,
    timeout: 10000,
    // port: 8080,
    responseType: 'json',
    xsrfHeaderName: null, // server passes token in a cookie
    xsrfCookieName: null, // but this option doesn't work outside of the browser environment
    headers: {
      'Content-Type': 'application/json',
      'Cookie': null, // so we will manually extract cookies from the response header
    },
  })

  instance.defaults.withCredentials = true

  instance.interceptors.response.use( response => {
    // Manually extract cookies which may contain the CSRF token
    if ( response.headers['set-cookie']) {
      instance.defaults.headers['Cookie'] = response.headers['set-cookie']
    }

    return Promise.resolve( response && response.data )
  },
  error => {
    // console.log(error)

    return Promise.reject( error )
  })

  return instance
})()
