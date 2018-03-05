
export const loadDraftSocialEntry = ({ RestService, SessionService, pResponseUser }) => async () => {
  const userId = SessionService.currentUserId()
  let user = await RestService.get('/users/' + userId )
  user = pResponseUser( user )
  SessionService.setUserSession( user )
}


// export const suggestTags = ({ RestService, pResponseTags }) => async ({ symbol, text }) => {
//   // TODO - Figoure out # encoding
//   if ( symbol === "#" ) {
//     symbol = "%23"
//   }
//   const payload = { symbol, text }
// 
//   const tags = await RestService.get('/tags', payload )
//   return pResponseTags(tags)
// }


export const updateDraftSocialEntry = ({ RestService, SessionService, pResponseUser }) => async (text, requestedAt) => {
  const userId = SessionService.currentUserId()
  const payload = { user: { draft_social_entry: { text: text} } }

  let user = await RestService.put('/users/' + userId, payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user, requestedAt)
}


export const postSocialEntry = ({ RestService, SessionService, pResponseUser }) => async text => {
  const userId = SessionService.currentUserId()
  const payload = { text }

  let user = await RestService.post('/users/' + userId + '/publish_draft_social_entry', payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user)
}
