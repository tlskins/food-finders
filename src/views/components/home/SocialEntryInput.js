import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TagSuggestions from '@components/home/TagSuggestions'
import close from '@res/images/x-icon-gray.png'

import {
  findWordAtCursor,
  getAllNestedValues,
  searchDictionaryBy,
  searchDictionaryByArray,
  searchDictionaryByKeys,
} from '~/utils'


const initialDraftSocialEntry = { text: '', tags: []}

class SocialEntryInput extends Component {
  constructor(props) {
    super(props)
    const { draftSocialEntry } = props

    this.state = {
      lastEditAt: undefined,
      text: (draftSocialEntry && draftSocialEntry.text) || '',
      searchText: '',
      searchHandles: undefined,
      searchStatus: undefined,
      draftSocialEntry: draftSocialEntry || initialDraftSocialEntry,
      tagSuggestions: [],
      tagSymbol: undefined,
      selectedTagIndex: undefined,
      cursorBeginIndex: 0,
      cursorEndIndex: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
      const { searchText, tagSymbol, lastEditAt } = this.state
      const { draftSocialEntry, requestedAt, tags, tagSearches } = nextProps

      if ( lastEditAt >= requestedAt ) {
        this.setState({ draftSocialEntry })
      }

      if ( tagSymbol ) {
        this.populateTagSuggestions(tags)

        if ( tagSearches[tagSymbol][searchText] ) {
          const searchStatuses = getAllNestedValues(tagSearches[tagSymbol][searchText])
          if ( searchStatuses.some( s => ['START_TAG_SEARCH', 'INCOMPLETE_TAG_SEARCH'].includes(s) ) ) {
            this.setState({ searchStatus: `Loading suggestions for '${ searchText }'...` })
          }
          else {
            this.setState({ searchStatus: `Loaded all suggestions for '${ searchText }'...` })
          }
        }
      }
  }

  populateTagSuggestions = (tags, tagsCount = 5) => {
    const { searchText, searchHandles, tagSymbol } = this.state
    const tagsBySymbol = { ...tags[tagSymbol] }
    delete tagsBySymbol.roots
    const roots = tags[tagSymbol].roots || []

    if ( Object.values(tagsBySymbol).length < 1 ) {
      return
    }

    if ( typeof searchText !== 'undefined' ) {
      if ( searchText.length > 0 ) {
        let tagSuggestions = searchDictionaryBy(tagsBySymbol, 'name', searchText)
        if ( tagSuggestions.length < tagsCount ) {
          const remainingCount = tagsCount - tagSuggestions.length
          tagSuggestions = [ ...tagSuggestions, ...searchDictionaryBy(tagsBySymbol, 'embeddedTaggable.description', searchText, remainingCount) ]
        }
        if ( tagSuggestions.length < tagsCount ) {
          const remainingCount = tagsCount - tagSuggestions.length
          tagSuggestions = [ ...tagSuggestions, ...searchDictionaryByArray(tagsBySymbol, 'embeddedTaggable.synonyms', searchText, remainingCount) ]
        }
        this.setState({ tagSuggestions, selectedTagIndex: 0 })
      }
      else {
        this.setState({ tagSuggestions: roots, selectedTagIndex: 0 })
      }
    }
    else if ( searchHandles ) {
      const searchKeys = searchHandles.map( h => h.slice(1) )
      if ( searchKeys.length > 0 ) {
        const tagSuggestions = searchDictionaryByKeys(tagsBySymbol, searchKeys)
        this.setState({ tagSuggestions })
      }
      else {
        this.setState({ tagSuggestions: roots, selectedTagIndex: 0 })
      }
    }
  }

  onKeyDown = e => {
    let { selectedTagIndex } = this.state
    const { tagSuggestions } = this.state
    if ( tagSuggestions.length > 0 ) {
      // right arrow key
      if ( e.keyCode === 39 ) {
        e.stopPropagation()
        e.preventDefault()
        const selectedTag = tagSuggestions[selectedTagIndex]
        const selectedTaggable = selectedTag.embeddedTaggable
        if ( selectedTaggable && selectedTaggable.children && selectedTaggable.children.length > 0 ) {
          const childTagHandles = selectedTaggable.children.map( c => c.tagSymbol + c.tagHandle )
          this.setState({
            searchHandles: childTagHandles,
            searchText: undefined,
            selectedTagIndex: 0,
            searchStatus: `Loading ${ selectedTag.name }...`,
          }, () => this.calculateTags() )
        }
      }
      // left arrow key
      else if ( e.keyCode === 37 ) {
        e.stopPropagation()
        e.preventDefault()
        const selectedTag = tagSuggestions[selectedTagIndex]
        if ( selectedTag.embeddedTaggable && selectedTag.embeddedTaggable.parent ) {
          const parentTaggable = selectedTag.embeddedTaggable.parent
          const parentHandle = parentTaggable.tagSymbol + parentTaggable.tagHandle
          const parentSiblingHandles = (parentTaggable && parentTaggable.siblings) || []
          this.setState({
            searchHandles: [parentHandle, ...parentSiblingHandles],
            searchText: undefined,
            selectedTagIndex: 0,
            searchStatus: `Loading ${ selectedTag.name }...`,
          }, () => this.calculateTags() )
        }
        else {
          this.setState({
            searchHandles: [],
            searchText: undefined,
            selectedTagIndex: 0,
          }, () => this.calculateTags() )
        }
      }
      // down arrow key
      else if ( e.keyCode === 40 ) {
        e.stopPropagation()
        e.preventDefault()
        selectedTagIndex += 1
        if ( selectedTagIndex >= tagSuggestions.length ) {
          selectedTagIndex = 0
        }
        this.setState({ selectedTagIndex })
      }
      // up arrow key
      else if ( e.keyCode === 38 ) {
        e.stopPropagation()
        e.preventDefault()
        selectedTagIndex -= 1
        if ( selectedTagIndex < 0 ) {
          selectedTagIndex = tagSuggestions.length - 1
        }
        this.setState({ selectedTagIndex })
      }
      // enter arrow key
      else if ( e.keyCode === 13 ) {
        e.stopPropagation()
        e.preventDefault()
        this.addTag( tagSuggestions[selectedTagIndex], new Date() )()
      }
    }
  }

  updateText = e => {
    const newText = e.target.value
    const selectionStart = e.target.selectionStart
    const currentEditAt = new Date()

    const cursorTextData = this.calculateCursorTextData(newText, selectionStart)
    this.setState({ text: newText, lastEditAt: currentEditAt, ...cursorTextData }, () => this.calculateTags(newText) )
    this.updateSocialEntry(newText, currentEditAt)
  }

  calculateCursorTextData = (text, selectionStart) => {
    const { currentWord, cursorBeginIndex, cursorEndIndex } = findWordAtCursor(text, selectionStart)
    const { tags } = this.props
    if ( currentWord && tags[currentWord[0]]) {
      const tagSymbol = currentWord[0]
      const searchText = currentWord.substr(1)

      return { cursorBeginIndex, cursorEndIndex, tagSymbol, searchText }
    }
    else {
      return { cursorBeginIndex, cursorEndIndex, tagSymbol: undefined, searchText: '' }
    }
  }

  updateSocialEntry = async (text, requestedAt) => {
    const { updateDraftSocialEntry } = this.props

    await updateDraftSocialEntry( text, requestedAt )
  }

  addTag = (tag, currentEditAt, editData = null) => () => {
    const { symbol, handle } = tag
    let { text, cursorBeginIndex, cursorEndIndex } = this.state
    if ( editData ) {
      cursorBeginIndex = editData.cursorBeginIndex
      cursorEndIndex = editData.cursorEndIndex
    }
    const newText = text.slice(0, cursorBeginIndex) + symbol + handle + text.slice(cursorEndIndex)

    this.setState({ text: newText })
    this.clearTagSearch()
    this.updateSocialEntry(newText, currentEditAt)
  }

  calculateTags = async (text = null) => {
    const { suggestTags, tags } = this.props
    const { searchHandles, searchText, tagSymbol } = this.state

    if ( tagSymbol ) {
      if ( typeof searchText !== 'undefined' ) {
        this.populateTagSuggestions(tags)
        if ( searchText.length > 0 ) {
          await suggestTags({ symbol: tagSymbol, text: searchText, resultsPerPage: 5, page: 1 })
        }
      }
      else if ( searchHandles ) {
        this.populateTagSuggestions(tags)
        await suggestTags({ symbol: tagSymbol, handles: searchHandles, resultsPerPage: 5, page: 1 })
      }
    }
    else {
      this.clearTagSearch()
    }
  }

  onPost = async () => {
    const { postSocialEntry } = this.props
    const { text } = this.state

    this.clearTagSearch()

    await postSocialEntry(text)

    this.props.toggleVisibility(false)
  }

  clearTagSearch = () => {
    this.setState({ tagSuggestions: [], searchStatus: undefined, tagSymbol: undefined, selectedTagIndex: undefined })
  }

  close = e => {
    e.preventDefault()

    this.props.toggleVisibility(false)
  }

  render() {
    const { text, draftSocialEntry, searchStatus, selectedTagIndex, tagSuggestions  } = this.state
    const { visible } = this.props
    const { tags } = draftSocialEntry

    if ( !visible ) {
      return null
    }

    return (
      <div className={ `modal-form-container` }>
        <div className="modal-form-container__screen"></div>
        <div className="modal-form-container__inner">
          <img className="close" src={ close } onClick={ this.close } />
          <h1 className='social-entry-form-header'> { `What's on your mind grapes` } </h1>
          <div className="social-entry-form">
            <textarea type="text"
              className="social-entry-form__textarea"
              value={ text }
              onChange={ this.updateText }
              onKeyDown={ this.onKeyDown }
              autoFocus
              tabIndex={ 1 }
              />
            { searchStatus && searchStatus }
            <div className="social-entry-form__tags">
              Existing Tags:
              { tags && tags.map( (t,i) =>
                <div className={ 'social-entry-tag__' + (t.taggableType || '').toLowerCase() }
                  key={ i }>
                  <p>
                    { t.symbol + t.handle }
                  </p>
                </div>
              ) }
            </div>

            Tag Suggestions:
            <TagSuggestions
              tagSuggestions={ tagSuggestions }
              selectedTagIndex={ selectedTagIndex }
              onClickTag={ this.addTag }
              onMouseOverTag={ (selectedTagIndex) => this.setState({ selectedTagIndex }) }
            />

            <div className="social-entry-form__submit--container">
              <input
                className="btn btn-3 btn-3e"
                type="submit"
                value="Post"
                tabIndex={ 2 }
                onClick={ this.onPost }
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SocialEntryInput.propTypes = {
  draftSocialEntry: PropTypes.object,
  tags: PropTypes.object,
  requestedAt: PropTypes.object,
  visible: PropTypes.bool,

  postSocialEntry: PropTypes.func,
  suggestTags: PropTypes.func,
  toggleVisibility: PropTypes.func,
  updateDraftSocialEntry: PropTypes.func,
}

export default SocialEntryInput
