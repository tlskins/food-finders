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

  getSelectedTag = () => {
    const { tagSuggestions, selectedTagIndex } = this.getSocialEntry()
    return tagSuggestions[selectedTagIndex]
  }

  loadDraftSocialEntry = draftSocialEntry => {
    this.dispatch( actions.updateSocialEntry(draftSocialEntry) )
    this._loadChildTags()
  }

  refreshTagSuggestions = () => {
    const { tagSymbol, searchText, searchHandles, selectedTagIndex } = this.getSocialEntry()
    const tagSuggestions = this._getTagSuggestions({ tagSymbol, searchText, searchHandles })
    const childTagSuggestions = this._getChildTags(tagSuggestions[selectedTagIndex])

    this.dispatch( actions.updateSocialEntry({
      tagSuggestions,
      childTagSuggestions,
    }) )
  }

  updateSearchText = ({ tagSymbol, text, searchText, cursorBeginIndex, cursorEndIndex }) => {
    const { selectedTagIndex } = this.getSocialEntry()
    const tagSuggestions = this._getTagSuggestions({ tagSymbol, searchText })
    const childTagSuggestions = this._getChildTags(tagSuggestions[selectedTagIndex])

    this.dispatch( actions.updateSocialEntry({
      childTagSuggestions,
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

  loadTagSuggestionsByHandles = ({ tagSymbol, searchHandles, selectedTagIndex }) => {
    const tagSuggestions = this._getTagSuggestions({ tagSymbol, searchHandles })
    const childTagSuggestions = this._getCurrentChildTags()

    this.dispatch( actions.updateSocialEntry({
      childTagSuggestions,
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
    this._loadChildTags()
  }

  addTagToText = (tag, updateText = true) => {
    const { symbol, handle } = tag
    const { socialEntry } = this.getState()
    let { text, cursorBeginIndex, cursorEndIndex, creatableTags } = socialEntry
    if ( updateText ) {
      text = text.slice(0, cursorBeginIndex) + symbol + handle + text.slice(cursorEndIndex)
    }
    const creatableTag = this._getCreatableTag(tag)
    creatableTags = this._validateCreatableTags(text, creatableTags, creatableTag)

    this.dispatch( actions.updateSocialEntry({
      text,
      creatableTags,
      selectedTagIndex: 0,
      // tagSuggestions: [tag],
    }) )
    this._loadChildTags()
  }

  addTaggableToCreatableTags = taggable => {
    const { socialEntry } = this.getState()
    const { text } = socialEntry
    let { creatableTags } = socialEntry
    const creatableTag = this._getCreatableTag(taggable)
    creatableTags = this._validateCreatableTags(text, creatableTags, creatableTag)

    this.dispatch( actions.updateSocialEntry({ creatableTags }) )
  }

  setParentSocialEntry = ({ parentSocialEntry }) => {
    this.dispatch( actions.updateSocialEntry({ parentSocialEntry }) )
  }

  // Helpers

  // TODO - Move all these helpers to tag service

  _getTagsBySymbol = ({ tagSymbol }) => {
    const { tagDictionary } = this.getState().tags
    const tagsBySymbol = tagDictionary[tagSymbol]
    const emptyTagsBySymbol = tagsBySymbol && Object.values(tagsBySymbol).length < 1
    if ( !tagsBySymbol || emptyTagsBySymbol ) {
      return undefined
    }
    return tagsBySymbol
  }

  _getCurrentChildTags = () => {
    const selectedTag = this.getSelectedTag()
    return this._getChildTags(selectedTag)
  }

  _getChildTags = selectedTag => {
    const { tagSymbol } = this.getSocialEntry()
    const tagsBySymbol = this._getTagsBySymbol({ tagSymbol })

    if ( selectedTag && selectedTag.embeddedTaggable && selectedTag.embeddedTaggable.children && tagsBySymbol ) {
      const { children } = selectedTag.embeddedTaggable
      return this._getTagsByKey({ tagsBySymbol, searchHandles: children })
    }
    else {
      return []
    }
  }

  _loadChildTags = () => {
    const childTagSuggestions = this._getCurrentChildTags()
    this.dispatch( actions.updateSocialEntry({ childTagSuggestions }) )
  }

  _getTagSuggestions = ({ tagSymbol, searchText, searchHandles }) => {
    const tagsBySymbol = this._getTagsBySymbol({ tagSymbol })
    if ( !tagsBySymbol ) {
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
      return this._getTagsByKey({ tagsBySymbol, searchHandles })
    }
    return roots
  }

  _getTagsByKey = ({ tagsBySymbol, searchHandles }) => {
    const searchKeys = searchHandles && searchHandles.map( h => h.slice(1) )
    if ( searchHandles && searchKeys.length > 0 ) {
      const tags = searchDictionaryByKeys(tagsBySymbol, searchKeys)

      return tags
    }
    else {
      return []
    }
  }

  _getCreatableTag = tag => {
    const { id, taggableType, symbol, handle } = tag

    if ( !id ) {
      if ( !tag.tmpId ) {
        // Add id to tag to identify uniqueness
        tag.tmpId = uniqid()
      }

      // if ( taggableType === 'Entity' && yelpBusiness ) {
      //   return { taggableType, symbol, handle, name: symbol + handle, taggableObject: tag }
      // }
      // else
      if ( taggableType === 'Food' ) {
        return { taggableType, symbol, handle, name: symbol + handle, taggableObject: tag }
      }
    }
  }

  _validateCreatableTags = (text, creatableTags, newTag) => {
    const validCreatableTags = []
    // Validate old tags & only front end created tags
    creatableTags.filter( t => t && t.taggableObject ).forEach( t => {
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
