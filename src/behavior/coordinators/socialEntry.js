
export const loadDraftSocialEntry = ({ RestService }) => async () => {
  // TODO - Remove hardcoded user id
  const response = await RestService.get('/users/5a6bca32d6f45f38424492b8')

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


export const updateDraftSocialEntry = ({ RestService }) => async text => {
  const payload = { user: { draft_social_entry: { text: text} } }

  const response = await RestService.put('/users/5a6bca32d6f45f38424492b8', payload )
  return response.draft_social_entry
}
