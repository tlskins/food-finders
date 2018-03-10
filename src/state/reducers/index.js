import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'
import * as hierarchiesReducers from './hierarchies'
import * as sessionsReducers from './sessions'
import * as tagsReducers from './tags'
import * as usersReducers from './users'
import uiReducers from './ui'


export default combineReducers({
  routing: routerReducer,
  ...hierarchiesReducers,
  ...sessionsReducers,
  ...tagsReducers,
  ...usersReducers,
  ...uiReducers,
})
