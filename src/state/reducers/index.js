import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'
import * as counterReducers from './counter'
import * as bestAwardReducers from './bestAward'
import * as entitiesReducers from './entities'
import * as hashtagsReducers from './hashtags'
import * as foodsReducers from './foods'


export default combineReducers({
  routing: routerReducer,
  ...counterReducers,
  ...bestAwardReducers,
  ...entitiesReducers,
  ...hashtagsReducers,
  ...foodsReducers,
})
