import * as errorsCoordinators from './errors'
import * as newsfeedCoordinators from './newsfeed'
import * as socialEntryCoordinators from './socialEntry'
import * as sessionCoordinators from './session'
import * as tagCoordinators from './tag'
import * as usersCoordinators from './users'


export default Object.freeze({
  ...errorsCoordinators,
  ...newsfeedCoordinators,
  ...socialEntryCoordinators,
  ...sessionCoordinators,
  ...tagCoordinators,
  ...usersCoordinators,
})
