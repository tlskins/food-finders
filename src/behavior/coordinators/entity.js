
export const createEntity = ({ RestService }) => async (yelp_business) => {
  const payload = { entity: { yelp_business } }

  const response = await RestService.post('/entities', payload )
  return response
}

export const searchEntitiesByBusinessId = ({ RestService }) => async (businessIds) => {
  const payload = { business_ids: businessIds }

  const response = await RestService.get('/entities', payload )
  return response
}
