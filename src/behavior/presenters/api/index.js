import * as genericApiPresenters from './generic'
import * as yelpApiPresenters from './yelp'
import * as newsfeedApiPresenters from './newsfeed'


export default {
  ...newsfeedApiPresenters,
  ...genericApiPresenters,
  ...yelpApiPresenters,
}
