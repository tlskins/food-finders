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
  updateSearchText = ({ tagSymbol, searchText, cursorBeginIndex, cursorEndIndex, selectedTagIndex }) => {
    this.dispatch( actions.updateSearchCriteria({
      tagSymbol,
      searchText,
      cursorBeginIndex,
      cursorEndIndex,
      searchHandles: undefined,
      selectedTagIndex
    }) )
  }
  updateSearchHandles = ({ tagSymbol, searchHandles, selectedTagIndex }) => {
    this.dispatch( actions.updateSearchCriteria({
      tagSymbol,
      searchText: undefined,
      searchHandles,
      selectedTagIndex
    }) )
  }
  resetSearchCriteria = () => this.dispatch( actions.resetSearchCriteria() )

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
