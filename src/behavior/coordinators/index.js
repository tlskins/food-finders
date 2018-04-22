import * as errorsCoordinators from './errors'
import * as newsfeedCoordinators from './newsfeed'
import * as socialEntryCoordinators from './socialEntry'
import * as sessionCoordinators from './session'
import * as hierarchiesCoordinators from './hierarchies'
import * as tagCoordinators from './tag'
import * as usersCoordinators from './users'
import * as foodRatingMetricsCoordinators from './foodRatingMetrics'
import * as taggablesCoordinators from './taggables'
import * as requestCoordinators from './request'
import * as composedCoordinators from './composed'


export default Object.freeze({
  ...errorsCoordinators,
  ...newsfeedCoordinators,
  ...socialEntryCoordinators,
  ...sessionCoordinators,
  ...hierarchiesCoordinators,
  ...tagCoordinators,
  ...usersCoordinators,
  ...foodRatingMetricsCoordinators,
  ...requestCoordinators,
  ...taggablesCoordinators,
  ...composedCoordinators,
})
