/*
Not great to have all service imports in a separate file, but is a workaround for
testing avoiding importing browserHistory node module
*/

import * as counterServices from './counter'


const services = {
  ...counterServices,
}

/* pass redux store dispatch and state to all services */
const ServiceInitializer = ( dispatch, getState ) => services => {
  const initializedServices = {}
  for ( const p in services ) {
    initializedServices[p] = new services[p]( dispatch, getState )
  }

  return initializedServices
}


let __services

export const initServices = ( store, moreServices = {}) => {
  const { dispatch, getState } = store
  const serviceInitializer = ServiceInitializer( dispatch, getState )
  __services = serviceInitializer({
    ...services,
    ...moreServices,
  })

  return __services
}
