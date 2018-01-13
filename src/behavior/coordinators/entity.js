
export const createEntity = ({ RestService }) => async (business) => {
  const payload = { entity: { business } }

  const response = await RestService.post('/entities', payload )
  return response
}

export const searchEntitiesByBusinessId = ({ RestService }) => async (businessIds) => {
  const payload = { business_ids: businessIds }

  const response = await RestService.get('/entities', payload )
  return response
}
