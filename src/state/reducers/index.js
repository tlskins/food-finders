import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'
import * as counterReducers from './counter'
import * as bestAwardReducers from './bestAward'


export default combineReducers({
  routing: routerReducer,
  ...counterReducers,
  ...bestAwardReducers,
})
