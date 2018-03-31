import { default as BaseService } from './base'
import actions from '@actions'
import {
  searchDictionaryBy,
  searchDictionaryByArray,
  searchDictionaryByKeys,
} from '~/utils'


export class SocialEntryService extends BaseService {
  
  getSocialEntry = () => {
    return this.getState().socialEntry
  }

  refreshTagSuggestions = () => {
    const { tagDictionary } = this.getState().tags
    const { tagSymbol, searchText, searchHandles } = this.getState().socialEntry
    const tagSuggestions = this._getTagSuggestions({ tagDictionary, tagSymbol, searchText, searchHandles })

    this.dispatch( actions.updateSocialEntry({ tagSuggestions }) )
  }

  updateSearchText = ({ tagSymbol, text, searchText, cursorBeginIndex, cursorEndIndex }) => {
    const { tagDictionary } = this.getState().tags
    const tagSuggestions = this._getTagSuggestions({ tagDictionary, tagSymbol, searchText })

    this.dispatch( actions.updateSocialEntry({
      cursorBeginIndex,
      cursorEndIndex,
      searchText,
      searchHandles: null,
      selectedTagIndex: 0,
      tagSuggestions,
      tagSymbol,
      text,
    }) )
  }

  updateSearchHandles = ({ tagSymbol, searchHandles, selectedTagIndex }) => {
    const { tagDictionary } = this.getState().tags
    const tagSuggestions = this._getTagSuggestions({ tagDictionary, tagSymbol, searchHandles })

    this.dispatch( actions.updateSocialEntry({
      searchText: null,
      searchHandles,
      selectedTagIndex,
      tagSuggestions,
      tagSymbol,
    }) )
  }

  resetSearchCriteria = () => {
    this.dispatch( actions.updateSocialEntry({
      tagSymbol: null,
      searchText: '',
      searchHandles: null,
      selectedTagIndex: 0,
    }) )
  }

  updateSelectedTagIndex = selectedTagIndex => {
    this.dispatch( actions.updateSocialEntry({ selectedTagIndex }) )
  }

  addTagToText = tag => {
    const { symbol, handle } = tag
    const { socialEntry } = this.getState()
    let { text, cursorBeginIndex, cursorEndIndex, creatableTags } = socialEntry
    const newText = text.slice(0, cursorBeginIndex) + symbol + handle + text.slice(cursorEndIndex)
    const creatableEntityTag = this._getCreatableEntityTag(tag, creatableTags)
    creatableTags = [ ...creatableTags, creatableEntityTag ]

    this.dispatch( actions.updateSocialEntry({
      text: newText,
      creatableTags,
      selectedTagIndex: 0,
      tagSuggestions: [tag],
    }) )
  }

  // Helpers

  _getTagSuggestions = ({ tagDictionary, tagSymbol, searchText, searchHandles }) => {
    const tagsBySymbol = tagDictionary[tagSymbol]
    const emptyTagsBySymbol = tagsBySymbol && Object.values(tagsBySymbol).length < 1
    if ( !tagsBySymbol || emptyTagsBySymbol ) {
      return []
    }
    const { roots = [] } = tagsBySymbol

    if ( searchText != null ) {
      if ( searchText.length > 0 ) {
        let tagSuggestions = []
        searchDictionaryBy(tagsBySymbol, 'name', searchText, tagSuggestions)
        searchDictionaryBy(tagsBySymbol, 'embeddedTaggable.description', searchText, tagSuggestions)
        searchDictionaryByArray(tagsBySymbol, 'embeddedTaggable.synonyms', searchText, tagSuggestions)

        return tagSuggestions
      }
    }
    else if ( searchHandles ) {
      const searchKeys = searchHandles.map( h => h.slice(1) )
      if ( searchKeys.length > 0 ) {
        const tagSuggestions = searchDictionaryByKeys(tagsBySymbol, searchKeys)

        return tagSuggestions
      }
    }
    return roots
  }

  _getCreatableEntityTag = (tag, creatableTags) => {
    const { id, yelpBusiness, taggableType, symbol, handle } = tag
    if ( !id ) {
      if ( taggableType === 'Entity' && yelpBusiness ) {
        return { taggableType, symbol, handle }
      }
    }
  }
}
