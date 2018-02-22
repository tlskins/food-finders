
export const suggestYelp = ({ RestService, pResponseYelpBusinesses }) => async (term) => {
  const response = await RestService.get('/yelp_search', { term: term } )
  return pResponseYelpBusinesses(response)
}
