import {
  ADD_USERS,
  ADD_USER_RELATIONSHIPS,
} from '@actions/users'

export const users = (state = {}, action) => {
  switch (action.type) {
    case ADD_USERS: {
      action.users.forEach( u => {
        if ( !state[u.id] ) {
          state[u.id] = { ...u, following: 'loading...', follower: 'loading...'}
        }
        else {
          state[u.id] = { ...state[u.id], ...u }
        }
     })

      return { ...state }
    }
    case ADD_USER_RELATIONSHIPS: {
      action.relationships.forEach( r => state[r.id] = { ...state[r.id], ...r } )

      return { ...state }
    }

    default:
      return state
  }
}
