import * as genericApiPresenters from './generic'
import * as yelpApiPresenters from './yelp'
import * as newsfeedApiPresenters from './newsfeed'
import * as taggableApiPresenters from './taggable'
import * as hierarchiesApiPresenters from './hierarchies'


export default {
  ...newsfeedApiPresenters,
  ...genericApiPresenters,
  ...yelpApiPresenters,
  ...taggableApiPresenters,
  ...hierarchiesApiPresenters,
}
