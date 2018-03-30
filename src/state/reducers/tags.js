import {
  ADD_TAGS,
  EDIT_TAG,
  LOAD_ROOT_TAGS,
  START_TAG_SEARCH,
  INCOMPLETE_TAG_SEARCH,
  COMPLETE_TAG_SEARCH,
} from '@actions/tags'

import {
  addNestedAttribute,
} from '~/utils'


const initialTagsState = {
  tagDictionary: {
    '@': {},
    '#': {},
    '^': {},
    '&': {},
  }
}

const initialTagSearchesState = { '@': {}, '#': {}, '^': {}, '&': {}}


export const tags = (state = initialTagsState, action) => {
  switch (action.type) {
    case ADD_TAGS: {
      const { tagDictionary } = state
      action.tags.forEach( e => tagDictionary[e.symbol][e.handle] = e )

      return { ...state, tagDictionary: { ...tagDictionary } }
    }
    case LOAD_ROOT_TAGS: {
      return { ...state, tagDictionary: { ...action.rootTags } }
    }

    default:
      return state
  }
}

export const editTag = ( state = {}, action) => {
  switch (action.type) {
    case EDIT_TAG: {

      return { ...action.tag }
    }

    default:
      return state
  }
}

export const tagSearches = (state = initialTagSearchesState, action) => {
  if ( [START_TAG_SEARCH, INCOMPLETE_TAG_SEARCH, COMPLETE_TAG_SEARCH].includes(action.type) ) {
    const targetAttr = [action.symbol, action.text,action.source,action.resultsPerPage,action.page].join('.')
    addNestedAttribute(state, targetAttr, action.type)

    return { ...state }
  }
  else {
    return state
  }
}
