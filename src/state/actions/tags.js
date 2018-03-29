export const ADD_TAGS = 'ADD_TAGS'

export const EDIT_TAG = 'EDIT_TAG'

export const LOAD_ROOT_TAGS = 'LOAD_ROOT_TAGS'

export const START_TAG_SEARCH = 'START_TAG_SEARCH'

export const INCOMPLETE_TAG_SEARCH = 'INCOMPLETE_TAG_SEARCH'

export const COMPLETE_TAG_SEARCH = 'COMPLETE_TAG_SEARCH'

export const UPDATE_SEARCH_CRITERIA = 'UPDATE_SEARCH_CRITERIA'

export const RESET_SEARCH_CRITERIA = 'RESET_SEARCH_CRITERIA'


export const addTags = (symbol, tags) => ({ type: ADD_TAGS, symbol, tags })

export const editTag = (tag) => ({ type: EDIT_TAG, tag })

export const loadRootTags = rootTags => ({ type: LOAD_ROOT_TAGS, rootTags })

export const startTagSearch = ({
  symbol,
  text,
  page,
  resultsPerPage,
  source,
}) => ({
    type: START_TAG_SEARCH,
    symbol,
    text,
    page,
    resultsPerPage,
    source })

export const incompleteTagSearch = ({
  symbol,
  text,
  page,
  resultsPerPage,
  source,
}) => ({
    type: INCOMPLETE_TAG_SEARCH,
    symbol,
    text,
    page,
    resultsPerPage,
    source })

export const completeTagSearch = ({
  symbol,
  text,
  page,
  resultsPerPage,
  source
}) => ({
    type: COMPLETE_TAG_SEARCH,
    symbol,
    text,
    page,
    resultsPerPage,
    source })

export const updateSearchCriteria = ({
  cursorBeginIndex,
  cursorEndIndex,
  tagSymbol,
  text,
  searchText,
  searchHandles,
  selectedTagIndex
}) => ({
  type: UPDATE_SEARCH_CRITERIA,
  cursorBeginIndex,
  cursorEndIndex,
  text,
  tagSymbol,
  searchText,
  searchHandles,
  selectedTagIndex,
})


export const resetSearchCriteria = () => ({ type: RESET_SEARCH_CRITERIA })
