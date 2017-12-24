import * as counterActions from './counter'
import * as yelpActions from './yelp'

const actions = Object.freeze({
  ...counterActions,
  ...yelpActions,
})


export default actions
