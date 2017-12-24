
export const searchYelp = ({ RestService, YelpService }) => async (term) => {
  console.log('searchYelp coordinator called')
  const yelpResults = await RestService.get('/yelp_search', { term: term } )
  console.log('results = ',yelpResults)
  YelpService.setYelpSuggestedLocations(yelpResults.response.businesses)
}

export const suggestYelp = ({ RestService }) => async (term) => {
  console.log('suggestYelp coordinator called')
  const yelpResults = await RestService.get('/yelp_search', { term: term } )
  console.log('results = ',yelpResults)
  return yelpResults.response.businesses
}
