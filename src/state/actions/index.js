import * as sessionsActions from './sessions'
import * as usersActions from './users'
import * as tagsActions from './tags'
import uiActions from './ui'


const actions = Object.freeze({
  ...sessionsActions,
  ...usersActions,
  ...tagsActions,
  ...uiActions,
})


export default actions
