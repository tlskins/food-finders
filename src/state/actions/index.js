import * as counterActions from './counter'
import * as bestAwardActions from './bestAward'
import * as entitiesAction from './entities'

const actions = Object.freeze({
  ...counterActions,
  ...bestAwardActions,
  ...entitiesAction,
})


export default actions
