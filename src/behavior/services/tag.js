import { default as BaseService } from './base'
import actions from '@actions'

export class TagService extends BaseService {
  // Tags
  addTags = (symbol, tags) => {
    this.dispatch( actions.addTags(symbol, tags) )
  }
  editTag = (tag) => {
    this.dispatch( actions.editTag(tag) )
  }
  loadRootTags = (rootTags) => {
    this.dispatch( actions.loadRootTags(rootTags) )
  }
  updateSearchText = (params) => {
    const { tagSymbol, text, searchText, cursorBeginIndex, cursorEndIndex, selectedTagIndex } = params
    this.dispatch( actions.updateSearchCriteria({
      tagSymbol,
      text,
      searchText,
      cursorBeginIndex,
      cursorEndIndex,
      searchHandles: undefined,
      selectedTagIndex
    }) )
  }
  updateSearchHandles = ({ tagSymbol, searchHandles, selectedTagIndex, text }) => {
    this.dispatch( actions.updateSearchCriteria({
      tagSymbol,
      text,
      searchText: undefined,
      searchHandles,
      selectedTagIndex
    }) )
  }
  resetSearchCriteria = () => this.dispatch( actions.resetSearchCriteria() )
  updateSelectedTagIndex = selectedTagIndex => this.dispatch( actions.updateSelectedTagIndex(selectedTagIndex) )

  // TODO - Move all social entry stuff to social entry service /reducer
  addTagToText = tag => {
    const { symbol, handle } = tag
    const { tags } = this.getState()

    let { text, cursorBeginIndex, cursorEndIndex, creatableTags } = tags
    const newText = text.slice(0, cursorBeginIndex) + symbol + handle + text.slice(cursorEndIndex)
    const creatableEntityTag = this._getCreatableEntityTag(tag, creatableTags)
    creatableTags = [ ...creatableTags, creatableEntityTag ]
    this.dispatch( actions.addTagToText({ text: newText, creatableTags }) )
    // TODO - Update draft social entry in coordinator too
  }

  _getCreatableEntityTag = (tag, creatableTags) => {
    const { id, yelpBusiness, taggableType, symbol, handle } = tag
    if ( !id ) {
      if ( taggableType === 'Entity' && yelpBusiness ) {
        return { taggableType, symbol, handle }
      }
    }
  }

  // Tag Searches
  startTagSearch = ({ symbol, text, page, resultsPerPage, source }) => {
    this.dispatch( actions.startTagSearch({ symbol, text, page, resultsPerPage, source }) )
  }
  incompleteTagSearch = ({ symbol, text, page, resultsPerPage, source }) => {
    this.dispatch( actions.incompleteTagSearch({ symbol, text, page, resultsPerPage, source }) )
  }
  completeTagSearch = ({ symbol, text, page, resultsPerPage, source }) => {
    this.dispatch( actions.completeTagSearch({ symbol, text, page, resultsPerPage, source }) )
  }
}
