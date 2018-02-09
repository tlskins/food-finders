import {
  ADD_USERS,
} from '@actions/users'

export const users = (state = {}, action) => {
  switch (action.type) {
    case ADD_USERS: {
      action.users.forEach( u => state[u.id] = u )

      return { ...state }
    }

    default:
      return state
  }
}
