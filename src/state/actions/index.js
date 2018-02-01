import * as counterActions from './counter'
import * as bestAwardActions from './bestAward'
import * as entitiesAction from './entities'
import * as hashtagsAction from './hashtags'
import * as foodsAction from './foods'

const actions = Object.freeze({
  ...counterActions,
  ...bestAwardActions,
  ...entitiesAction,
  ...hashtagsAction,
  ...foodsAction,
})


export default actions
