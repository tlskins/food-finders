import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'
import * as bestAwardReducers from './bestAward'
import * as entitiesReducers from './entities'
import * as hashtagsReducers from './hashtags'
import * as foodsReducers from './foods'
import * as sessionsReducers from './sessions'
import * as tagsReducers from './tags'
import * as usersReducers from './users'
import uiReducers from './ui'


export default combineReducers({
  routing: routerReducer,
  ...bestAwardReducers,
  ...entitiesReducers,
  ...hashtagsReducers,
  ...foodsReducers,
  ...sessionsReducers,
  ...tagsReducers,
  ...usersReducers,
  ...uiReducers,
})
