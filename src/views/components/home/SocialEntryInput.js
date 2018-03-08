import React, { Component } from 'react'
import PropTypes from 'prop-types'

import close from '@res/images/x-icon-gray.png'

import {
  findWordAtCursor,
  getAllNestedValues,
  searchDictionaryBy,
  searchDictionaryByArray,
  stringDifference,
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
      const { draftSocialEntry, requestedAt, tagSearches } = nextProps

      if ( lastEditAt >= requestedAt ) {
        this.setState({ draftSocialEntry })
      }

      if ( tagSymbol ) {
        this.populateTagSuggestions(nextProps, tagSymbol, searchText)

        if ( tagSearches[tagSymbol][searchText] ) {
          const searchStatuses = getAllNestedValues(tagSearches[tagSymbol][searchText])
          if ( searchStatuses.includes('START_TAG_SEARCH', 'INCOMPLETE_TAG_SEARCH')) {
            this.setState({ searchStatus: `Loading suggestions for '${ searchText }'...` })
          }
          else {
            this.setState({ searchStatus: `Loaded all suggestions for '${ searchText }'...` })
          }
        }
      }
  }

  populateTagSuggestions = (props, tagSymbol, searchText, tagsCount = 5) => {
    const { tags } = props
    const tagsBySymbol = tags[tagSymbol]

    if ( Object.values(tagsBySymbol).length < 1 ) {
      return
    }

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
    else if ( tagsBySymbol['roots'] ) {
      this.setState({ tagSuggestions: tagsBySymbol['roots'], selectedTagIndex: 0 })
    }
  }

  onKeyDown = e => {
    let { selectedTagIndex } = this.state
    const { tagSuggestions } = this.state
    if ( tagSuggestions.length > 0 ) {
      // down arrow key
      if ( e.keyCode === 40 ) {
        e.stopPropagation()
        e.preventDefault()
        selectedTagIndex -= 1
        if ( selectedTagIndex < 0 ) {
          selectedTagIndex = tagSuggestions.length - 1
        }
        this.setState({ selectedTagIndex })
      }
      // up arrow key
      if ( e.keyCode === 38 ) {
        e.stopPropagation()
        e.preventDefault()
        selectedTagIndex += 1
        if ( selectedTagIndex >= tagSuggestions.length ) {
          selectedTagIndex = 0
        }
        this.setState({ selectedTagIndex })
      }
    }
  }

  updateText = e => {
    const newText = e.target.value
    const selectionStart = e.target.selectionStart
    const { selectedTagIndex, tagSuggestions, text } = this.state
    const currentEditAt = new Date()

    console.log('newText=',newText)

    const editData = this.updateCurrentEditData(newText, selectionStart)
    this.setState({ text: newText, lastEditAt: currentEditAt })

    if ( tagSuggestions.length > 0 && stringDifference(text,newText) === '\n' ) {
      this.addTag(tagSuggestions[selectedTagIndex], currentEditAt, editData)()
    }
    else {
      this.updateSocialEntry(newText, currentEditAt)
      this.calculateTags(newText, editData['tagSymbol'], editData['searchText'] )
    }
  }

  updateCurrentEditData = (text, selectionStart) => {
    const { currentWord, cursorBeginIndex, cursorEndIndex } = findWordAtCursor(text, selectionStart)
    const { tags } = this.props
    if ( currentWord && tags[currentWord[0]]) {
      const tagSymbol = currentWord[0]
      const searchText = currentWord.substr(1)

      this.setState({ cursorBeginIndex, cursorEndIndex, tagSymbol, searchText })
      return { cursorBeginIndex, cursorEndIndex, tagSymbol, searchText }
    }
    else {
      this.setState({ cursorBeginIndex, cursorEndIndex, tagSymbol: undefined, searchText: '' })
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

  calculateTags = async (text, tagSymbol, searchText) => {
    const { suggestTags } = this.props

    if ( tagSymbol  ) {
      this.populateTagSuggestions(this.props, tagSymbol, searchText)
      if ( searchText && searchText.length > 0 ) {
        await suggestTags({ symbol: tagSymbol, text: searchText, resultsPerPage: 5, page: 1 })
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
    const selectedTag = tagSuggestions[selectedTagIndex]
    const childTags = (selectedTag && selectedTag.embeddedTaggable && selectedTag.embeddedTaggable.children) || []
    // const childTags = selectedTag ? (selectedTag.children || []) : []
    const parentTaggableType = selectedTag && selectedTag.taggableType.toLowerCase()

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
            <div className='social-entry-form__suggestions-container'>
              <div className='social-entry-form__suggestions'>
                { tagSuggestions.map( (t,i) =>
                  <div
                    key={i}
                    className={ 'social-entry-form__suggestions__item--' + (t.taggableType || '').toLowerCase() + (selectedTagIndex === i ? ' selected ' : '') }
                    onClick={ this.addTag(t, new Date()) }
                    onMouseEnter={ () => this.setState({ selectedTagIndex: i }) }
                  >
                    <div className={ 'social-entry-form__suggestions__icon--' + (t.taggableType || '').toLowerCase() }/>
                    <div>
                      { t.name }
                    </div>
                    <p className={ 'form__suggestions__item--description' }>
                      { t.embeddedTaggable && t.embeddedTaggable.description && `${ t.embeddedTaggable.description }` }
                    </p>
                    <p className={ 'form__suggestions__item--description' }>
                      { t.embeddedTaggable && t.embeddedTaggable.synonyms.length > 0 && `Synonyms: ${ t.embeddedTaggable.synonyms }` }
                    </p>
                  </div>
                ) }
              </div>
              <div className='social-entry-form__suggestions-children'>
                { childTags.map( (t,i) =>
                  <div
                    key={i}
                    className={ 'social-entry-form__suggestions__shortitem--' + parentTaggableType }
                  >
                    <div>
                      { t.name }
                    </div>
                    <p className={ 'form__suggestions__item--description' }>
                      { t.description }
                    </p>
                  </div>
                ) }
              </div>
            </div>
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
