/*
Not great to have all service imports in a separate file, but is a workaround for
testing avoiding importing browserHistory node module
*/

import * as RestService from './rest'
import * as RouterService from './router'
import * as SessionService from './session'
import * as TagService from './tag'
import * as UsersService from './users'
import * as HierarchiesService from './hierarchies'
import UIService from './ui/index'

const coreServices = {
  ...RestService,
  ...RouterService,
  ...SessionService,
  ...TagService,
  ...UsersService,
  ...HierarchiesService,
  UIService,
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
