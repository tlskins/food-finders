import axios from './axios'


export const get = function( uri, params, headers ) {
  /* encode params */
  let queryString = ''
  const keys = Object.keys( params )
  if ( keys.length === 1 ) {
    queryString += `?${encodeURI( keys[0])}=${encodeURI( params[keys[0]])}`
  }
  else if ( keys.length > 1 ) {
    queryString += `?${encodeURI( keys[0])}=${encodeURI( params[keys[0]])}`
    for ( const key of keys.slice( 1 )) {
      queryString += `&${encodeURI( key )}=${encodeURI( params[key])}`
    }
  }

  return axios.request({
    method: 'get',
    url: uri + queryString,
    headers: headers,
  })
}


export const post = function( uri, data, headers ) {
  return axios.request({
    method: 'post',
    url: uri,
    data: data,
    headers: headers,
  })
}


export const put = function( uri, data, headers ) {
  return axios.request({
    method: 'put',
    url: uri,
    data: data,
    headers: headers,
  })
}


const delete_ = function( uri, data, headers ) {
  return axios.request({
    method: 'delete',
    data: data,
    url: uri,
    headers: headers,
  })
}


export { delete_ as delete }
