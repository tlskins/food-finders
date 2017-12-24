import * as counterActions from './counter'
import * as bestAwardActions from './bestAward'

const actions = Object.freeze({
  ...counterActions,
  ...bestAwardActions,
})


export default actions
