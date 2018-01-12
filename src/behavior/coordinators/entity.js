
export const createEntity = ({ RestService }) => async (business) => {
  console.log('createEntity business = ',business)
  const payload = { entity: { business } }

  const response = await RestService.post('/entities', payload )
  return response
}
