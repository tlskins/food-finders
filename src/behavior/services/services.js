/*
Not great to have all service imports in a separate file, but is a workaround for
testing avoiding importing browserHistory node module
*/

import * as CounterService from './counter'

// const services = {
//   RestService,
//   SessionService,
// }

const coreServices = CounterService

/* pass redux store dispatch and state to all services */
const ServiceInitializer = ( dispatch, getState ) => services => {
  const initializedServices = {}
  for ( const p in services ) {
    console.log('initializing service: ',services[p])
    console.log('services loop, this = ',this)
    initializedServices[p] = new services[p]( dispatch, getState )
  }

  return initializedServices
}


let __services

export const initServices = ( store, moreServices = {}) => {
  const { dispatch, getState } = store

  const serviceInitializer = ServiceInitializer( dispatch, getState )
  __services = serviceInitializer({
    ...coreServices,
    ...moreServices,
  })

  return __services
}

// export const loadServices = () => {
//   return __services
// }
