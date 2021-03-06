export const LoadRootTags = async ({ TagService, RestService, pResponseRoots }) => {
  const response = await RestService.get('/api/tags/all_roots' )
  const tags = pResponseRoots(response)
  TagService.loadRootTags(tags)
}


export const SearchYelpBusinesses = ({ RestService, pResponseYelpBusinesses }) => async term => {
  const response = await RestService.get('/api/entities/yelp_businesses_search', { term } )
  return pResponseYelpBusinesses(response)
}


// Returns true if new tags suggested
export const SuggestTags = ({ RestService, TagService, pResponseTags, pResponseYelpBusinesses }) =>
async ({ symbol, text, handles, resultsPerPage, page }) =>
{
  if ( !symbol || (!text && !handles)) {
    return false
  }

  if ( text ) {
    const searchIndex = { symbol, text, resultsPerPage, page }
    if ( symbol === '@' ) {
      const priorYelpSearchStatus = _getPriorSearchStatus({ source: 'yelp', TagService, searchIndex })
      if ( !priorYelpSearchStatus || priorYelpSearchStatus === 'INCOMPLETE' ) {
        await _searchYelpTags({ TagService, RestService, pResponseYelpBusinesses, searchIndex })
        return true
      }
    }

    const priorCoreSearchStatus = _getPriorSearchStatus({ source: 'core', TagService, searchIndex })
    if ( !priorCoreSearchStatus || priorCoreSearchStatus === 'INCOMPLETE' ) {
      await _searchCoreTags({ TagService, RestService, pResponseTags, searchIndex })
      return true
    }
  }
  else if ( handles ) {
    // Currently just used for tag navigation -> hiearchical tags which dont cover entities so dont need to search yelp
    const missingTags = _getMissingTags({ symbol, TagService, handles })
    if ( missingTags.length > 0 ) {
      await _searchCoreTags({ TagService, RestService, pResponseTags, searchIndex: { symbol, handles: missingTags, resultsPerPage, page } })
      return true
    }
  }
  return false
}


export const EditTag = ({ RestService, TagService, pResponseTags, UIService }) => async (symbol, handle) => {
  const { tags } = TagService.getState()
  const editTag = tags[symbol][handle]
  if ( editTag ) {
    UIService.TagEditor.toggleVisibility(true)
    TagService.editTag(editTag)
  }
  else {
    const handles = [symbol + handle]
    const searchIndex = { symbol, handles, resultsPerPage: 1, page: 1 }
    UIService.TagEditor.toggleVisibility(true)
    const foundTags = await _searchCoreTagsByHandles({ TagService, RestService, pResponseTags, searchIndex })
    TagService.editTag(foundTags[0])
  }
}

// helpers

const _getPriorSearchStatus = ({ source, TagService, searchIndex }) => {
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


const _getMissingTags = ({ symbol, TagService, handles }) => {
  const { tags } = TagService.getState()
  const { tagDictionary } = tags
  const tagsBySymbol = tagDictionary[symbol]
  return handles.filter( h => !tagsBySymbol[h.slice(1)])
}


const _searchCoreTags = async ({ TagService, RestService, pResponseTags, searchIndex }) => {
  const { text, handles } = searchIndex
  if ( text ) {
    await _searchCoreTagsByText({ TagService, RestService, pResponseTags, searchIndex })
  }
  else if ( handles ) {
    await _searchCoreTagsByHandles({ TagService, RestService, pResponseTags, searchIndex })
  }
}


const _searchCoreTagsByText = async ({ TagService, RestService, pResponseTags, searchIndex }) => {
  const { symbol, text, resultsPerPage, page } = searchIndex
  let parsedSymbol = symbol
  if ( symbol === "#" ) {
    parsedSymbol = "%23"
  }
  const payload = { symbol: parsedSymbol, text, results_per_page: resultsPerPage, page }
  const coreSearchIndex = { ...searchIndex, source: 'core' }
  try {
    TagService.startTagSearch(coreSearchIndex)
    const response = await RestService.get('/api/tags', payload )
    const tags = pResponseTags(response)
    TagService.addTags(symbol, tags)
    TagService.completeTagSearch(coreSearchIndex)
  }
  catch ( error ) {
    TagService.incompleteTagSearch(coreSearchIndex)
  }
}


const _searchCoreTagsByHandles = async ({ TagService, RestService, pResponseTags, searchIndex }) => {
  const { symbol, handles, resultsPerPage, page } = searchIndex
  const payload = { handles: encodeURIComponent(handles), results_per_page: resultsPerPage, page }
  const response = await RestService.get('/api/tags', payload )
  const tags = pResponseTags(response)
  TagService.addTags(symbol, tags)
  return tags
}


const _searchYelpTags = async ({ TagService, RestService, pResponseYelpBusinesses, searchIndex }) => {
  const { symbol, text } = searchIndex
  const yelpSearchIndex = { ...searchIndex, source: 'yelp' }
  TagService.startTagSearch(yelpSearchIndex)
  try {
    const response = await RestService.get('/api/entities/yelp_businesses_search', { term: text } )
    const tags = pResponseYelpBusinesses(response)
    TagService.addTags(symbol, tags)
    TagService.completeTagSearch(yelpSearchIndex)
  }
  catch ( error ) {
    TagService.incompleteTagSearch(yelpSearchIndex)
  }
}
