import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'
import * as counterReducers from './counter'
import * as bestAwardReducers from './bestAward'
import * as entitiesReducers from './entities'


export default combineReducers({
  routing: routerReducer,
  ...counterReducers,
  ...bestAwardReducers,
  ...entitiesReducers,
})
