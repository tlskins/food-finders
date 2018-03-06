import {
  ADD_TAGS,
  LOAD_ROOT_TAGS,
  START_TAG_SEARCH,
  INCOMPLETE_TAG_SEARCH,
  COMPLETE_TAG_SEARCH,
} from '@actions/tags'


const initialTagsState = { '@': {}, '#': {}, '^': {}, '&': {}}
const initialTagSearchesState = { '@': {}, '#': {}, '^': {}, '&': {}}

export const tags = (state = {...initialTagsState}, action) => {
  switch (action.type) {
    case ADD_TAGS: {
      action.tags.forEach( e => state[e.symbol][e.handle] = e )

      return { ...state }
    }
    case LOAD_ROOT_TAGS: {
      return { ...action.rootTags }
    }

    default:
      return state
  }
}

export const tagSearches = (state = {...initialTagSearchesState}, action) => {
  if ( [START_TAG_SEARCH, INCOMPLETE_TAG_SEARCH, COMPLETE_TAG_SEARCH].includes(action.type) ) {
    if ( !state[action.symbol] ) {
      state[action.symbol] = {}
    }
    if ( !state[action.symbol][action.text] ) {
      state[action.symbol][action.text] = {}
    }
    if ( !state[action.symbol][action.text][action.source] ) {
      state[action.symbol][action.text][action.source] = {}
    }
    if ( !state[action.symbol][action.text][action.source][action.resultsPerPage] ) {
      state[action.symbol][action.text][action.source][action.resultsPerPage] = {}
    }
    state[action.symbol][action.text][action.source][action.resultsPerPage][action.page] = action.type

    return { ...state }
  }
  else {
    return state
  }
}
