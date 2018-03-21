import * as sessionsActions from './sessions'
import * as usersActions from './users'
import * as tagsActions from './tags'
import * as hierarchiesActions from './hierarchies'
import * as foodRatingMetricsActions from './foodRatingMetrics'
import * as taggablesActions from './taggables'
import uiActions from './ui'


const actions = Object.freeze({
  ...sessionsActions,
  ...usersActions,
  ...tagsActions,
  ...hierarchiesActions,
  ...foodRatingMetricsActions,
  ...taggablesActions,
  ...uiActions,
})


export default actions
