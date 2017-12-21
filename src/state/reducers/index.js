import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'
import * as counterReducers from './counter'

export default combineReducers({
  routing: routerReducer,
  ...counterReducers,
})
