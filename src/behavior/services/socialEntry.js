import { default as BaseService } from './base'
import actions from '@actions'
import {
  searchDictionaryBy,
  searchDictionaryByArray,
  searchDictionaryByKeys,
  sortByAttribute,
} from '~/utils'

import uniqid from 'uniqid'


export class SocialEntryService extends BaseService {

  getSocialEntry = () => {
    return this.getState().socialEntry
  }

  loadDraftSocialEntry = draftSocialEntry => {
    this.dispatch( actions.updateSocialEntry(draftSocialEntry) )
  }

  refreshTagSuggestions = () => {
    console.log('SERVICE BEGIN refreshTagSuggestions')
    const { tagDictionary } = this.getState().tags
    const { tagSymbol, searchText, searchHandles } = this.getState().socialEntry
    const tagSuggestions = this._getTagSuggestions({ tagDictionary, tagSymbol, searchText, searchHandles })

    this.dispatch( actions.updateSocialEntry({ tagSuggestions }) )
  }

  updateSearchText = ({ tagSymbol, text, searchText, cursorBeginIndex, cursorEndIndex }) => {
    const { tagDictionary } = this.getState().tags
    const tagSuggestions = this._getTagSuggestions({ tagDictionary, tagSymbol, searchText })
    console.log('SERVICE updateSearchText ',{ tagSymbol, text, searchText, cursorBeginIndex, cursorEndIndex },' tagSuggestions=',tagSuggestions)

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
    console.log('SERVICE BEGIN updateSearchHandles')
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

  addTagToText = (tag, updateText = true) => {
    console.log('SERVICE BEGIN addTagToText')
    const { symbol, handle } = tag
    const { socialEntry } = this.getState()
    let { text, cursorBeginIndex, cursorEndIndex, creatableTags } = socialEntry
    let newText = text
    if ( updateText ) {
      newText = text.slice(0, cursorBeginIndex) + symbol + handle + text.slice(cursorEndIndex)
    }
    const creatableTag = this._getCreatableTag(tag, cursorBeginIndex, cursorEndIndex)
    creatableTags = this._validateCreatableTags(newText, creatableTags, creatableTag)

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
        let tagSuggestions = searchDictionaryByKeys(tagsBySymbol, [searchText])
        searchDictionaryBy(tagsBySymbol, 'handle', searchText, tagSuggestions)
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

  _getCreatableTag = (tag, cursorBeginIndex, cursorEndIndex) => {
    const { id, yelpBusiness, taggableType, symbol, handle } = tag

    if ( !id ) {
      if ( !tag.tmpId ) {
        // Add id to tag to identify uniqueness
        tag.tmpId = uniqid()
      }

      if ( taggableType === 'Entity' && yelpBusiness ) {
        return { taggableType, symbol, handle, name: symbol + handle, taggableObject: tag }
      }
      else if ( taggableType === 'Food'  ) {
        return { taggableType, symbol, handle, name: symbol + handle, taggableObject: tag }
      }
    }
  }

  _validateCreatableTags = (text, creatableTags, newTag) => {
    const validCreatableTags = []
    // Validate old tags
    creatableTags.filter( t => t ).forEach( t => {
      const { symbol, handle, taggableObject } = t
      const tagPattern = new RegExp('\\' + symbol + handle,'i')
      // validate tag still exists within text AND reject duplicates
      const newTagId = newTag && newTag.taggableObject && newTag.taggableObject.tmpId
      if ( tagPattern.test(text) && ( !newTagId || taggableObject.tmpId !== newTagId ) ) {
        validCreatableTags.push(t)
      }
    })
    // Validate new tag
    if ( newTag ) {
      const { symbol, handle } = newTag
      const tagPattern = new RegExp('\\' + symbol + handle,'i')
      if ( tagPattern.test(text) ) {
        validCreatableTags.push(newTag)
      }
    }
    sortByAttribute(validCreatableTags, 'handle')

    return validCreatableTags
  }
}
