import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TagSuggestions from '@components/socialEntry/TagSuggestions'
import CurrentTags from '@components/socialEntry/CurrentTags'
import SocialEntryRating from '@components/socialEntry/SocialEntryRating'
import SocialEntryDetailPanel from '@containers/socialEntry/SocialEntryDetailPanel'
import close from '@res/images/x-icon-gray.png'

import {
  findWordAtCursor,
  getAllNestedValues,
} from '~/utils'


const initialDraftSocialEntry = { text: '', tags: []}

class SocialEntryInput extends Component {
  constructor(props) {
    console.log('SocialEntryInput constructor called')
    super(props)
    const { draftSocialEntry } = props

    this.state = {
      lastEditAt: undefined,
      text: (draftSocialEntry && draftSocialEntry.text) || '',
      searchText: undefined,
      searchHandles: undefined,
      searchStatus: undefined,
      draftSocialEntry: draftSocialEntry || initialDraftSocialEntry,
      tagSuggestions: [],
      tagSymbol: undefined,
      selectedTagIndex: 0,
      creatableTags: (draftSocialEntry && draftSocialEntry.creatableTags) || [],
      cursorBeginIndex: 0,
      cursorEndIndex: 0,
      visible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { tagSearches, tagSymbol, searchText } = nextProps
    if ( this.props !== nextProps ) {
      this.setState({ ...nextProps })

      const searchTextSearchStatuses = tagSearches[tagSymbol] && tagSearches[tagSymbol][searchText]
      this.updateSearchStatus(searchTextSearchStatuses, searchText)
    }
  }

  updateText = e => {
    const { creatableTags, selectedTagIndex } = this.state
    const { updateSearchText, updateDraftSocialEntry } = this.props
    const newText = e.target.value
    const selectionStart = e.target.selectionStart

    this.setState({ text: newText })
    const cursorTextData = this.calculateCursorTextData(newText, selectionStart)
    updateSearchText({ ...cursorTextData, selectedTagIndex })
    if ( cursorTextData.tagSymbol ) {
      updateDraftSocialEntry(newText, creatableTags)
      this.loadNewTags({ searchText: cursorTextData.searchText, tagSymbol: cursorTextData.tagSymbol })
    }
  }

  calculateCursorTextData = (text, selectionStart) => {
    const { currentWord, cursorBeginIndex, cursorEndIndex } = findWordAtCursor(text, selectionStart)
    const firstChar = currentWord && currentWord[0]
    if ( firstChar && ['@','#','^','&'].includes(firstChar) ) {
      const tagSymbol = firstChar
      const searchText = currentWord.substr(1)

      return { cursorBeginIndex, cursorEndIndex, tagSymbol, text, searchText }
    }
    else {
      return { cursorBeginIndex, cursorEndIndex, tagSymbol: undefined, text, searchText: '' }
    }
  }

  updateSearchStatus = (searchTextSearchStatuses, searchText) => {
    if ( searchTextSearchStatuses ) {
      const searchStatuses = getAllNestedValues(searchTextSearchStatuses)
      if ( searchStatuses.some( s => ['START_TAG_SEARCH', 'INCOMPLETE_TAG_SEARCH'].includes(s) ) ) {
        this.setState({ searchStatus: `Loading suggestions for '${ searchText }'...` })
      }
      else {
        this.setState({ searchStatus: `Loaded all suggestions for '${ searchText }'...` })
      }
    }
  }

  onKeyDown = e => {
    const { addTagToText, updateSearchHandles, searchHandles, updateSelectedTagIndex } = this.props
    let { selectedTagIndex } = this.state
    const { text, tagSymbol, tagSuggestions } = this.state
    if ( tagSuggestions.length > 0 ) {
      // right arrow key
      if ( e.keyCode === 39 ) {
        e.stopPropagation()
        e.preventDefault()
        const selectedTag = tagSuggestions[selectedTagIndex]
        const selectedTaggable = selectedTag.embeddedTaggable
        if ( selectedTaggable && selectedTaggable.children && selectedTaggable.children.length > 0 ) {
          const childTagHandles = selectedTaggable.children.filter( c => {
            return c.tagSymbol && c.tagHandle
          }).map( c => c.tagSymbol + c.tagHandle )

          this.setState({ searchStatus: `Loading ${ selectedTag.name }...` })
          updateSearchHandles({ tagSymbol, searchHandles: childTagHandles, selectedTagIndex, text })
          this.loadNewTags({ searchHandles: childTagHandles, tagSymbol })
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
          const newSearchHandles = [parentHandle, ...parentSiblingHandles]

          this.setState({ searchStatus: `Loading ${ selectedTag.name }...` })
          updateSearchHandles({ tagSymbol, searchHandles: newSearchHandles, selectedTagIndex: 0, text })
          this.loadNewTags({ searchHandles: newSearchHandles, tagSymbol })
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
        updateSelectedTagIndex(selectedTagIndex)
      }
      // up arrow key
      else if ( e.keyCode === 38 ) {
        e.stopPropagation()
        e.preventDefault()
        selectedTagIndex -= 1
        if ( selectedTagIndex < 0 ) {
          selectedTagIndex = tagSuggestions.length - 1
        }
        updateSelectedTagIndex(selectedTagIndex)
      }
      // enter arrow key
      else if ( e.keyCode === 13 ) {
        e.stopPropagation()
        e.preventDefault()
        updateSelectedTagIndex(0)
        addTagToText( tagSuggestions[selectedTagIndex] )
      }
    }
  }

  // updateSocialEntry = async (text, creatableTags) => {
  //   const { updateDraftSocialEntry } = this.props
  //   await updateDraftSocialEntry( text, creatableTags )
  // }

  loadNewTags = ({ searchHandles, searchText, tagSymbol }) => {
    const { suggestTags } = this.props
    if ( tagSymbol ) {
      if ( typeof searchText !== 'undefined' ) {
        if ( searchText.length > 0 ) {
          suggestTags({ symbol: tagSymbol, text: searchText, resultsPerPage: 5, page: 1 })
        }
      }
      else if ( searchHandles ) {
        suggestTags({ symbol: tagSymbol, handles: searchHandles, resultsPerPage: 5, page: 1 })
      }
    }
    else {
      this.clearTagSearch()
    }
  }

  onPost = async () => {
    const { postSocialEntry } = this.props
    const { text, creatableTags } = this.state

    this.clearTagSearch()

    await postSocialEntry(text, creatableTags)

    this.props.toggleVisibility(false)
  }

  clearTagSearch = () => {
    const { resetSearchCriteria } = this.props
    resetSearchCriteria()
    this.setState({ searchStatus: undefined })
  }

  close = e => {
    e.preventDefault()

    this.props.toggleVisibility(false)
  }

  render() {
    const { text, draftSocialEntry, searchStatus, selectedTagIndex, tagSuggestions  } = this.state
    const { addTagToText, visible } = this.props
    const { tags, creatableTags } = draftSocialEntry

    if ( !visible ) {
      return null
    }

    return (
      <div className="modal-form-container">
        <div className="modal-screen"></div>
        <div className="modal-inner-container">
          <div className="modal-section">
            <img className="close" src={ close } onClick={ this.close } alt="close-form"/>
            <div className='social-entry-form-header item-header'> New Social Entry </div>
            <SocialEntryRating tags={ tags } />
          </div>

          <div className="modal-column-section">
            <div className="social-entry-form">
              <textarea type="text"
                className="social-entry-form-textarea"
                value={ text }
                onChange={ this.updateText }
                onKeyDown={ this.onKeyDown }
                autoFocus
                tabIndex={ 1 }
                rows={ 7 }
              />
              <CurrentTags
                tags={ tags }
                creatableTags={ creatableTags }
              />
              <TagSuggestions
                tagSuggestions={ tagSuggestions }
                searchStatus={ searchStatus }
                selectedTagIndex={ selectedTagIndex }
                onClickTag={ addTagToText }
                onMouseOverTag={ (selectedTagIndex) => this.setState({ selectedTagIndex }) }
              />
              <div className="modal-section">
                <button
                  className="header-button"
                  tabIndex={ 2 }
                  onClick={ this.onPost }
                >
                  Post
                </button>
              </div>
            </div>

            <SocialEntryDetailPanel
              panelStyle={{ width: '500px' }}
              mapStyle={{ width: '500px', height: '500px' }}
            />
          </div>

        </div>
      </div>
    )
  }
}

SocialEntryInput.propTypes = {
  creatableTags: PropTypes.arrayOf(PropTypes.object),
  cursorBeginIndex: PropTypes.number,
  cursorEndIndex: PropTypes.number,
  draftSocialEntry: PropTypes.object,
  tagSuggestions: PropTypes.arrayOf(PropTypes.object),
  tagSymbol: PropTypes.string,
  searchText: PropTypes.string,
  searchHandles: PropTypes.arrayOf(PropTypes.string),
  selectedTagIndex: PropTypes.numbrer,
  tagSearches: PropTypes.object,
  visible: PropTypes.bool,

  addTagToText: PropTypes.func,
  postSocialEntry: PropTypes.func,
  resetSearchCriteria: PropTypes.func,
  suggestTags: PropTypes.func,
  toggleVisibility: PropTypes.func,
  updateSearchHandles: PropTypes.func,
  updateSearchText: PropTypes.func,
  updateDraftSocialEntry: PropTypes.func,
  updateSelectedTagIndex: PropTypes.func,
}

export default SocialEntryInput
