import React, { Component } from 'react'
import PropTypes from 'prop-types'

import close from '@res/images/x-icon-gray.png'

import { findWordAtCursor, searchDictionaryBy, stringDifference } from '~/utils'

const initialDraftSocialEntry = { text: '', tags: []}

class SocialEntryInput extends Component {
  constructor(props) {
    super(props)
    const { draftSocialEntry } = props

    this.state = {
      enterPressed: false,
      lastEditAt: undefined,
      text: (draftSocialEntry && draftSocialEntry.text) || '',
      searchText: '',
      draftSocialEntry: draftSocialEntry || initialDraftSocialEntry,
      tagSuggestions: [],
      tagSymbol: undefined,
      cursorBeginIndex: 0,
      cursorEndIndex: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
      const { searchText, tagSymbol, lastEditAt } = this.state
      const { draftSocialEntry, requestedAt } = nextProps

      if ( lastEditAt >= requestedAt ) {
        this.setState({ draftSocialEntry })
      }

      if ( tagSymbol ) {
        this.populateTagSuggestions(nextProps, tagSymbol, searchText)
      }
  }

  asyncSuggestSetTags = async (symbol, text) => {
    const { addEntities, addHashtags, addFoods, suggestTags } = this.props
    const tagSuggestions = await suggestTags({ symbol, text })

    // Remove these hardcode symbols too
    if ( symbol === '@' ) {
      addEntities && addEntities(tagSuggestions)
    }
    else if ( symbol === '#' ) {
      addHashtags && addHashtags(tagSuggestions)
    }
    else if ( symbol === '^' ) {
      addFoods && addFoods(tagSuggestions)
    }
  }

  asyncSuggestSetYelp = async text => {
    const { addYelpBusinessEntities, suggestYelp } = this.props
    const yelpSuggestions = await suggestYelp( text )

    addYelpBusinessEntities && addYelpBusinessEntities(yelpSuggestions)
  }

  populateTagSuggestions = (props, tagSymbol, searchText) => {
    const { entities, hashtags, foods } = props

    if ( tagSymbol === '@' ) {
      this.setState({ tagSuggestions: searchDictionaryBy(entities, 'name', searchText) })
    }
    else if ( tagSymbol === '#' ) {
      this.setState({ tagSuggestions: searchDictionaryBy(hashtags, 'name', searchText) })
    }
    else if ( tagSymbol === '^' ) {
      this.setState({ tagSuggestions: searchDictionaryBy(foods, 'name', searchText) })
    }
  }

  calculateTags = (text) => {
    const { tagSymbol, searchText } = this.state
    // search in redux
    this.populateTagSuggestions(this.props, tagSymbol, searchText)

    // async populate tags in redux
    this.asyncSuggestSetTags(tagSymbol, searchText)
    if ( tagSymbol === "@" ) {
      this.asyncSuggestSetYelp(searchText)
    }
  }

  addTag = (tag, currentEditAt) => () => {
    const { symbol, handle } = tag
    let { text, cursorBeginIndex, cursorEndIndex } = this.state
    const newText = text.slice(0, cursorBeginIndex) + symbol + handle + text.slice(cursorEndIndex)

    this.setState({ tagSuggestions: [], text: newText })
    this.updateSocialEntry(newText, currentEditAt)
  }
    
  updateCurrentEditData = (text, selectionStart) => {
    const { currentWord, cursorBeginIndex, cursorEndIndex } = findWordAtCursor(text, selectionStart)
    const tagSymbol = currentWord && currentWord[0]
    const searchText = currentWord && currentWord.substr(1)

    this.setState({ cursorBeginIndex, cursorEndIndex, tagSymbol, searchText })
  }

  updateText = e => {
    const newText = e.target.value
    const selectionStart = e.target.selectionStart
    const { enterPressed, tagSuggestions, text } = this.state
    const currentEditAt = new Date()
    
    console.log('newText=',newText)
    
    this.setState({ text: newText, lastEditAt: currentEditAt })
    
    if ( tagSuggestions.length > 0 && stringDifference(text,newText) === '\n' ) {
      this.updateCurrentEditData(newText, selectionStart)
      this.addTag(tagSuggestions[0], currentEditAt)()
    }
    else {
      this.updateSocialEntry(newText, currentEditAt)
      this.updateCurrentEditData(newText, selectionStart)
      this.calculateTags(newText)
    }
  }

  updateSocialEntry = async (text, requestedAt) => {
    const { updateDraftSocialEntry } = this.props

    await updateDraftSocialEntry( text, requestedAt )
  }

  onPost = async () => {
    const { postSocialEntry } = this.props
    const { text } = this.state

    this.setState({ tagSuggestions: [] })

    await postSocialEntry(text)
        
    this.props.toggleVisibility(false)
  }
  
  close = e => {
    e.preventDefault()

    this.props.toggleVisibility(false)
  }

  render() {
    const { text, draftSocialEntry, tagSuggestions  } = this.state
    const { visible } = this.props
    const { tags } = draftSocialEntry
    
    console.log('tags=',tags)
    
    if ( !visible ) {
      return null
    }

    return (
      <div className={ `modal-form-container` }>
        <div className="modal-form-container__screen"></div>
        <div className="modal-form-container__inner">
          <img className="close" src={ close } onClick={ this.close } />
          <h1> Compose Message </h1>
          <div className="social-entry-form">
            <textarea type="text"
              className="social-entry-form__textarea"
              value={ text }
              onChange={ this.updateText }
              onKeyDown={ this.onKeyDown }
              />
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
            <div className='social-entry-form__suggestions'>
              Tag Suggestions:
              { tagSuggestions.map( (t,i) =>
                <div 
                  key={i}
                  className={ 'social-entry-form__suggestions__item--' + (t.taggableType || '').toLowerCase() }
                  onClick={ this.addTag(t, new Date()) }
                >
                  <div className={ 'social-entry-form__suggestions__icon--' + (t.taggableType || '').toLowerCase() }/>
                  { t.symbol + t.handle + ": " + t.name }
                </div>
              ) }
            </div>
            <div className="social-entry-form__submit--container">
              <input
                className="btn btn-3 btn-3e"
                type="submit" 
                value="Post" 
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
  entities: PropTypes.object,
  foods: PropTypes.object,
  hashtags: PropTypes.object,
  requestedAt: PropTypes.object,
  visible: PropTypes.bool,

  addEntities: PropTypes.func,
  addYelpBusinessEntities: PropTypes.func,
  addHashtags: PropTypes.func,
  addFoods: PropTypes.func,
  postSocialEntry: PropTypes.func,
  suggestTags: PropTypes.func,
  suggestYelp: PropTypes.func,
  toggleVisibility: PropTypes.func,
  updateDraftSocialEntry: PropTypes.func,
}

export default SocialEntryInput
