
export const suggestYelp = ({ RestService }) => async (term) => {
  let response = await RestService.get('/yelp_search', { term: term } )
  response.businesses && response.businesses.map(business => {
    business.handle = business.id
    business.symbol = "@"
    return business
  })
  return response.businesses
}
