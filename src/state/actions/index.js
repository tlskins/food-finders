import * as sessionsActions from './sessions'
import * as usersActions from './users'
import * as tagsActions from './tags'
import * as hierarchiesActions from './hierarchies'
import uiActions from './ui'


const actions = Object.freeze({
  ...sessionsActions,
  ...usersActions,
  ...tagsActions,
  ...hierarchiesActions,
  ...uiActions,
})


export default actions
