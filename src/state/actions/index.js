import * as bestAwardActions from './bestAward'
import * as entitiesActions from './entities'
import * as hashtagsActions from './hashtags'
import * as foodsActions from './foods'
import * as sessionsActions from './sessions'
import * as usersActions from './users'
import * as tagsActions from './tags'
import uiActions from './ui'


const actions = Object.freeze({
  ...bestAwardActions,
  ...entitiesActions,
  ...hashtagsActions,
  ...foodsActions,
  ...sessionsActions,
  ...usersActions,
  ...tagsActions,
  ...uiActions,
})


export default actions
