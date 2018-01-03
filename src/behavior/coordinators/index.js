import * as yelpCoordinators from './yelp'
import * as foodCoordinators from './food'
import * as entityCoordinators from './entity'

export default Object.freeze({
  ...yelpCoordinators,
  ...foodCoordinators,
  ...entityCoordinators,
})
