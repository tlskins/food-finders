import * as genericApiPresenters from './generic'
import * as yelpApiPresenters from './yelp'


export default {
  ...genericApiPresenters,
  ...yelpApiPresenters,
}
