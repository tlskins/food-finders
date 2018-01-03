import * as yelpCoordinators from './yelp'
import * as foodCoordinators from './food'

export default Object.freeze({
  ...yelpCoordinators,
  ...foodCoordinators,
})
