const getPriorSearchStatus = ({ source, TagService, searchIndex }) => {
  const { tagSearches } = TagService.getState()
  const { symbol, text, resultsPerPage, page } = searchIndex
  let priorSearchStatus
  try {
    priorSearchStatus = tagSearches[symbol][text][source][resultsPerPage][page]
  }
  catch ( error ) {
    priorSearchStatus = null
  }
  return priorSearchStatus
}


const searchCoreTags = async ({ TagService, RestService, pResponseTags, searchIndex }) => {
  const { symbol, text, resultsPerPage, page } = searchIndex
  let parsedSymbol = symbol
  if ( symbol === "#" ) {
    parsedSymbol = "%23"
  }
  const payload = { symbol: parsedSymbol, text, results_per_page: resultsPerPage, page }
  const coreSearchIndex = { ...searchIndex, source: 'core' }
  try {
    TagService.startTagSearch(coreSearchIndex)
    const response = await RestService.get('/tags', payload )
    const tags = pResponseTags(response)
    TagService.addTags(symbol, tags)
    TagService.completeTagSearch(coreSearchIndex)
  }
  catch ( error ) {
    TagService.incompleteTagSearch(coreSearchIndex)
  }
}


const searchYelpTags = async ({ TagService, RestService, pResponseYelpBusinesses, searchIndex }) => {
  const { symbol, text } = searchIndex
  const yelpSearchIndex = { ...searchIndex, source: 'yelp' }
  TagService.startTagSearch(yelpSearchIndex)
  try {
    const response = await RestService.get('/yelp_search', { term: text } )
    const tags = pResponseYelpBusinesses(response)
    TagService.addTags(symbol, tags)
    TagService.completeTagSearch(yelpSearchIndex)
  }
  catch ( error ) {
    TagService.incompleteTagSearch(yelpSearchIndex)
  }
}


export const suggestTags = ({ RestService, TagService, pResponseTags, pResponseYelpBusinesses }) => ({ symbol, text, resultsPerPage, page }) => {
  const searchIndex = { symbol, text, resultsPerPage, page }

  if ( symbol === '@' ) {
    const priorYelpSearchStatus = getPriorSearchStatus({ source: 'yelp', TagService, searchIndex })
    if ( !priorYelpSearchStatus || priorYelpSearchStatus === 'INCOMPLETE' ) {
      searchYelpTags({ TagService, RestService, pResponseYelpBusinesses, searchIndex })
    }
  }

  const priorCoreSearchStatus = getPriorSearchStatus({ source: 'core', TagService, searchIndex })
  if ( !priorCoreSearchStatus || priorCoreSearchStatus === 'INCOMPLETE' ) {
    searchCoreTags({ TagService, RestService, pResponseTags, searchIndex })
  }
}
