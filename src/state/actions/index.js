import * as sessionsActions from './sessions'
import * as usersActions from './users'
import * as tagsActions from './tags'
import * as hierarchiesActions from './hierarchies'
import * as foodRatingMetricsActions from './foodRatingMetrics'
import * as taggablesActions from './taggables'
import * as socialEntryActions from './socialEntry'
import uiActions from './ui'


const actions = Object.freeze({
  ...sessionsActions,
  ...usersActions,
  ...tagsActions,
  ...hierarchiesActions,
  ...foodRatingMetricsActions,
  ...taggablesActions,
  ...socialEntryActions,
  ...uiActions,
})


export default actions
