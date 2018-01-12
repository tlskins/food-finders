
export const createEntity = ({ RestService }) => async (business) => {
  console.log('createEntity business = ',business)
  const payload = { entity: { business } }

  const response = await RestService.post('/entities', payload )
  return response
}

export const searchEntitiesByBusinessId = ({ RestService }) => async (businessIds) => {
  const payload = { business_ids: businessIds }
  console.log('coordinator - payload = ',payload)

  const response = await RestService.get('/entities', payload )
  return response
}
