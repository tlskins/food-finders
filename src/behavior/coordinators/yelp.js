
export const searchYelp = ({ RestService }) => async (term) => {
  // const menuCards = FakeService.fakeMenuCards()
  // MenuCardService.setMenuCards( menuCards )
  // const availableFilters = await FakeService.fakeFilters()
  // MenuCardService.loadFilters( availableFilters )
  console.log('searchYelp coordinator called')
  const yelpResults = await RestService.get('/yelp_search', { term: term } )
  console.log('results = ',yelpResults)
}
