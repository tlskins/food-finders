
export const createEntity = ({ RestService }) => async (business) => {
  console.log('createEntity business = ',business)
  const params = {
    entity: { business }
  }

  const response = await RestService.post('/entities', params )
  return response
}
