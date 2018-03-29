import {
  ADD_TAGS,
  EDIT_TAG,
  LOAD_ROOT_TAGS,
  START_TAG_SEARCH,
  INCOMPLETE_TAG_SEARCH,
  COMPLETE_TAG_SEARCH,
  UPDATE_SEARCH_CRITERIA,
  RESET_SEARCH_CRITERIA,
} from '@actions/tags'

import {
  addNestedAttribute,
  searchDictionaryBy,
  searchDictionaryByArray,
  searchDictionaryByKeys,
} from '~/utils'

// Helpera and Intial States

const initialTagSearchCriteriaState = {
  searchText: undefined,
  searchHandles: undefined,
  tagSuggestions: [],
  tagSymbol: undefined,
  text: '',
  cursorBeginIndex: 0,
  cursorEndIndex: 0,
  selectedTagIndex: 0,
}

const initialTagsState = {
  tagDictionary: {
    '@': {},
    '#': {},
    '^': {},
    '&': {},
  }, ...initialTagSearchCriteriaState }

const initialTagSearchesState = { '@': {}, '#': {}, '^': {}, '&': {}}

const getTagSuggestions = ({ tagDictionary, tagSymbol, tagsCount, searchText, searchHandles, selectedTagIndex }) => {
  const tagsBySymbol = tagDictionary[tagSymbol]
  const emptyTagsBySymbol = tagsBySymbol && Object.values(tagsBySymbol).length < 1
  if ( !tagsBySymbol || emptyTagsBySymbol ) {
    return { tagSuggestions: [], selectedTagIndex: 0 }
  }

  const roots = tagsBySymbol.roots || []

  if ( typeof searchText !== 'undefined' ) {
    if ( searchText.length > 0 ) {
      let tagSuggestions = []
      searchDictionaryBy(tagsBySymbol, 'name', searchText, tagSuggestions)
      searchDictionaryBy(tagsBySymbol, 'embeddedTaggable.description', searchText, tagSuggestions)
      searchDictionaryByArray(tagsBySymbol, 'embeddedTaggable.synonyms', searchText, tagSuggestions)

      return { tagSuggestions, selectedTagIndex: 0 }
    }
  }
  else if ( searchHandles ) {
    const searchKeys = searchHandles.map( h => h.slice(1) )
    if ( searchKeys.length > 0 ) {
      const tagSuggestions = searchDictionaryByKeys(tagsBySymbol, searchKeys)

      return { tagSuggestions, selectedTagIndex }
    }
  }
  return { tagSuggestions: roots, selectedTagIndex }
}

// Reducers //

export const tags = (state = initialTagsState, action) => {
  switch (action.type) {
    case ADD_TAGS: {
      let { tagDictionary } = state
      const { searchHandles, tagSymbol, searchText, selectedTagIndex } = state
      action.tags.forEach( e => tagDictionary[e.symbol][e.handle] = e )
      const tagSuggestionsHash = getTagSuggestions({
        tagDictionary,
        tagSymbol,
        tagsCount: 5,
        searchText,
        searchHandles,
        selectedTagIndex,
      })

      return {
        ...state,
        tagDictionary,
        ...tagSuggestionsHash
      }
    }
    case LOAD_ROOT_TAGS: {
      let { tagDictionary } = state
      const { searchHandles, tagSymbol, searchText, selectedTagIndex } = state
      tagDictionary = action.rootTags
      const tagSuggestionsHash = getTagSuggestions({
        tagDictionary,
        tagSymbol,
        tagsCount: 5,
        searchText,
        searchHandles,
        selectedTagIndex,
      })

      return {
        ...state,
        tagDictionary,
        ...tagSuggestionsHash
      }
    }
    case UPDATE_SEARCH_CRITERIA: {
      let { tagDictionary } = state

      const {
        searchText,
        tagSymbol,
        text,
        searchHandles,
        selectedTagIndex,
        cursorBeginIndex,
        cursorEndIndex
      } = action
      const tagSuggestionsHash = getTagSuggestions({
        tagDictionary,
        tagSymbol,
        tagsCount: 5,
        searchText,
        searchHandles,
        selectedTagIndex,
      })

      return {
        ...state,
        searchText,
        tagSymbol,
        text,
        cursorBeginIndex,
        cursorEndIndex,
        searchHandles,
        selectedTagIndex,
        ...tagSuggestionsHash,
      }
    }
    case RESET_SEARCH_CRITERIA: {
      return { ...state, ...initialTagSearchCriteriaState }
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
