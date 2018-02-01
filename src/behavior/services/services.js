/*
Not great to have all service imports in a separate file, but is a workaround for
testing avoiding importing browserHistory node module
*/

import * as CounterService from './counter'
import * as RestService from './rest'
import * as YelpService from './yelp'
import * as EntityService from './entity'

const coreServices = {
  ...CounterService,
  ...EntityService,
  ...RestService,
  ...YelpService,
}

/* pass redux store dispatch and state to all services */
const ServiceInitializer = ( dispatch, getState ) => services => {
  const initializedServices = {}
  for ( const p in services ) {
    console.log('initializing service: ',services[p])
    initializedServices[p] = new services[p]( dispatch, getState )
  }

  return initializedServices
}


let __services

export const initServices = ( store, moreServices = {}) => {
  const { dispatch, getState } = store
  const serviceInitializer = ServiceInitializer( dispatch, getState )

  console.log('coreServices = ',coreServices)
  __services = serviceInitializer({
    ...coreServices,
    ...moreServices,
  })

  return __services
}

// export const loadServices = () => {
//   return __services
// }
