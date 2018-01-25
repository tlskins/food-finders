import * as entityCoordinators from './entity'
import * as foodCoordinators from './food'
import * as socialEntryCoordinators from './socialEntry'
import * as yelpCoordinators from './yelp'

export default Object.freeze({
  ...yelpCoordinators,
  ...foodCoordinators,
  ...entityCoordinators,
  ...socialEntryCoordinators,
})
