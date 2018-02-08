import * as counterActions from './counter'
import * as bestAwardActions from './bestAward'
import * as entitiesActions from './entities'
import * as hashtagsActions from './hashtags'
import * as foodsActions from './foods'
import * as sessionsActions from './sessions'
import uiActions from './ui'


const actions = Object.freeze({
  ...counterActions,
  ...bestAwardActions,
  ...entitiesActions,
  ...hashtagsActions,
  ...foodsActions,
  ...sessionsActions,
  ...uiActions,
})


export default actions
