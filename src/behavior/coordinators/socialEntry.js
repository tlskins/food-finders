
export const loadDraftSocialEntry = ({ RestService, SessionService, pResponseUser }) => async () => {
  const userId = SessionService.currentUserId()
  let user = await RestService.get('/users/' + userId )
  user = pResponseUser( user )
  SessionService.setUserSession( user )
}


export const updateDraftSocialEntry = ({ RestService, SessionService, pResponseUser, pRequestUpdateSocialEntry }) => async (text, creatableTags, requestedAt = new Date()) => {
  const userId = SessionService.currentUserId()
  const payload = pRequestUpdateSocialEntry({ text, creatableTags })

  let user = await RestService.put('/users/' + userId, payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user, requestedAt)
}


export const postSocialEntry = ({ RestService, SessionService, pResponseUser, pRequestUpdateSocialEntry }) => async (text, creatableTags) => {
  const userId = SessionService.currentUserId()
  const payload = pRequestUpdateSocialEntry({ text, creatableTags })

  let user = await RestService.post('/users/' + userId + '/publish_draft_social_entry', payload )
  user = pResponseUser(user)
  SessionService.setUserSession(user)
}
