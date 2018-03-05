import * as entityCoordinators from './entity'
import * as errorsCoordinators from './errors'
import * as foodCoordinators from './food'
import * as newsfeedCoordinators from './newsfeed'
import * as socialEntryCoordinators from './socialEntry'
import * as sessionCoordinators from './session'
import * as yelpCoordinators from './yelp'
import * as tagCoordinators from './tag'
import * as usersCoordinators from './users'


export default Object.freeze({
  ...yelpCoordinators,
  ...errorsCoordinators,
  ...foodCoordinators,
  ...newsfeedCoordinators,
  ...entityCoordinators,
  ...socialEntryCoordinators,
  ...sessionCoordinators,
  ...tagCoordinators,
  ...usersCoordinators,
})
