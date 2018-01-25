
export const updateDraftSocialEntry = ({ RestService }) => async text => {
  console.log('updateDraftSocialEntry text = ',text)

  const payload = { user: { draft_social_entry: { text: text} } }

  console.log('updateDraftSocialEntry payload = ',payload)
  const response = await RestService.put('/users/5a542f58d6f45f91875bf067', payload )
  return response.draft_social_entry
}


// export const createDraftSocialEntry = ({ RestService }) => async text => {
//   const payload = { user: { draft_social_entry_attributes: { text } } }
//
//   // TODO - Remove hardcoded user id
//   const response = await RestService.put('/users/5a542f58d6f45f91875bf067', payload )
//   return response
// }


export const loadDraftSocialEntry = ({ RestService }) => async () => {
  // TODO - Remove hardcoded user id
  const response = await RestService.get('/users/5a542f58d6f45f91875bf067')

  return response.draft_social_entry
}
