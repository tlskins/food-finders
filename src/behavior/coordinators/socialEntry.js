
export const loadDraftSocialEntry = ({ RestService, SessionService }) => async () => {
  const userId = SessionService.currentUserId()
  const response = await RestService.get('/users/' + userId )

  return response.draft_social_entry
}


export const suggestTags = ({ RestService }) => async ({ symbol, text }) => {
  // TODO - Figoure out # encoding
  if ( symbol === "#" ) {
    symbol = "%23"
  }
  const payload = { symbol, text }

  const response = await RestService.get('/tags', payload )
  return response
}


export const updateDraftSocialEntry = ({ RestService, SessionService }) => async text => {
  const userId = SessionService.currentUserId()
  const payload = { user: { draft_social_entry: { text: text} } }

  const response = await RestService.put('/users/' + userId, payload )
  return response.draft_social_entry
}


export const postSocialEntry = ({ RestService, SessionService }) => async () => {
  const userId = SessionService.currentUserId()
  const response = await RestService.post('/users/' + userId + '/publish_draft_social_entry' )
  console.log('postSocialEntry response=',response)
  return response.draft_social_entry
}
