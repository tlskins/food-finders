
export const searchUsersByText = ({ RestService, UsersService, SessionService, pResponseUsers, pResponseRelationships, HandleError }) => async text => {
  try {
    const payload = { text }
    let users = await RestService.get('/users/', payload  )
    users = pResponseUsers( users )
    UsersService.addUsers( users )

    const userId = SessionService.currentUserId()
    const userIds = users.map( u => u.id )
    let relationships = await RestService.get('users/' + userId + '/match_relationships', { user_ids: userIds })
    relationships = pResponseRelationships(relationships)
    UsersService.addUserRelationships(relationships)
  }
  catch( error ) {
    HandleError({ error, namespace: 'friendsManager'})
  }
}

export const updateUserRelationship = ({ RestService, SessionService, UsersService, pResponseUser, HandleError }) => async ({targetId, type}) => {
  try {
    let user = SessionService.currentUser()
    user = await RestService.put('users/' + user.id + '/update_relationship', { target_id: targetId, type })
    user = pResponseUser(user)
    SessionService.setUserSession( user )

    const following = type === 'follow' ? 'Yes' : 'No'
    UsersService.addUserRelationships( [{ id: targetId, following }])
  }
  catch( error ) {
    HandleError({ error, namespace: 'friendsManager'})
  }
}
