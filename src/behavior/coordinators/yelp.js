
export const suggestYelp = ({ RestService }) => async (term) => {
  const response = await RestService.get('/yelp_search', { term: term } )
  return response.businesses
}
