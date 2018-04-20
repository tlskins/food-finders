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
  getTag = (symbol, handle) => {
    const tagsBySymbol = this.getTagsBySymbol(symbol)
    if ( !tagsBySymbol) {
      return undefined
    }
    else {
      return tagsBySymbol[handle]
    }
  }
  getTagsBySymbol = (symbol) => {
    const { tagDictionary } = this.getState().tags

    const tagsBySymbol = tagDictionary[symbol]
    const emptyTagsBySymbol = tagsBySymbol && Object.values(tagsBySymbol).length < 1
    if ( !tagsBySymbol || emptyTagsBySymbol ) {
      return undefined
    }
    return tagsBySymbol
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
