
export const loadFoods = ({ RestService }) => async () => {
  const response = await RestService.get('/foods')
  return response
}
