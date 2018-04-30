import { combineReducers } from 'redux'

import { routerReducer } from 'react-router-redux'
import * as actionablesReducers from './actionables'
import * as hierarchiesReducers from './hierarchies'
import * as sessionsReducers from './sessions'
import * as tagsReducers from './tags'
import * as usersReducers from './users'
import * as foodRatingMetricsReducers from './foodRatingMetrics'
import * as taggablesReducers from './taggables'
import * as socialEntryReducers from './socialEntry'
import uiReducers from './ui'


export default combineReducers({
  routing: routerReducer,
  ...actionablesReducers,
  ...hierarchiesReducers,
  ...sessionsReducers,
  ...tagsReducers,
  ...usersReducers,
  ...foodRatingMetricsReducers,
  ...taggablesReducers,
  ...socialEntryReducers,
  ...uiReducers,
})
