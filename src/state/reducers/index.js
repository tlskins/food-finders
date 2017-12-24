import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'
import * as counterReducers from './counter'
import * as yelpReducers from './yelp'

export default combineReducers({
  routing: routerReducer,
  ...counterReducers,
  ...yelpReducers,
})
