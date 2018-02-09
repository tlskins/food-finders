
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


// export const suggestTags = ({ RestService }) => async ({ symbol, text }) => {
//   // TODO - Figoure out # encoding
//   if ( symbol === "#" ) {
//     symbol = "%23"
//   }
//   const payload = { symbol, text }
//
//   const response = await RestService.get('/tags', payload )
//   return response
// }
//
//
// export const updateDraftSocialEntry = ({ RestService, SessionService, pResponseUser }) => async text => {
//   const userId = SessionService.currentUserId()
//   const payload = { user: { draft_social_entry: { text: text} } }
//
//   let user = await RestService.put('/users/' + userId, payload )
//   user = pResponseUser(user)
//   SessionService.setUserSession(user)
// }
//
//
// export const postSocialEntry = ({ RestService, SessionService, pResponseUser }) => async () => {
//   const userId = SessionService.currentUserId()
//   let user = await RestService.post('/users/' + userId + '/publish_draft_social_entry' )
//   user = pResponseUser(user)
//   SessionService.setUserSession(user)
// }
