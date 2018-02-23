import React, { Component } from 'react'
import PropTypes from 'prop-types'

import close from '@res/images/x-icon-gray.png'

import { findWordAtCursor, searchDictionaryBy } from '~/utils'

const initialDraftSocialEntry = { text: '', tags: []}

class SocialEntryInput extends Component {
  constructor(props) {
    super(props)
    const { draftSocialEntry } = props

    this.state = {
      text: (draftSocialEntry && draftSocialEntry.text) || '',
      searchText: '',
      refreshText: false,
      draftSocialEntry: draftSocialEntry || initialDraftSocialEntry,
      tagSuggestions: [],
      tagSymbol: undefined,
      cursorBeginIndex: 0,
      cursorEndIndex: 0,
      suppressUpdateText: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps !== this.props ) {
      const { refreshText, searchText, tagSymbol } = this.state
      const { draftSocialEntry } = nextProps

      // maintain text in state during edit but refresh on submit to limit unnecessary text delays
      if ( refreshText && this.state.draftSocialEntry !== draftSocialEntry ) {
        this.setState({
          draftSocialEntry,
          refreshText: false,
          text: (draftSocialEntry && draftSocialEntry.text) || ''
        })
      }
      else {
        this.setState({ draftSocialEntry })
      }

      if ( tagSymbol ) {
        this.populateTagSuggestions(nextProps, tagSymbol, searchText)
      }
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

  calculateTags = (text, selectionStart) => {
    const { currentWord, cursorBeginIndex, cursorEndIndex } = findWordAtCursor(text, selectionStart)
    const tagSymbol = currentWord && currentWord[0]
    const searchText = currentWord && currentWord.substr(1)

    if ( tagSymbol && ["@", "#", "^"].includes(tagSymbol) ) {
      this.setState({ cursorBeginIndex, cursorEndIndex, tagSymbol, searchText })

      // search in redux
      this.populateTagSuggestions(this.props, tagSymbol, searchText)

      // async populate tags in redux
      this.asyncSuggestSetTags(tagSymbol, searchText)
      if ( tagSymbol === "@" ) {
        this.asyncSuggestSetYelp(searchText)
      }
    }
  }

  addTag = tag => () => {
    const { symbol, handle } = tag
    let { text, cursorBeginIndex, cursorEndIndex } = this.state

    this.setState({
      tagSuggestions: [],
      text: text.slice(0, cursorBeginIndex) + symbol + handle + text.slice(cursorEndIndex),
    })
  }

  updateText = e => {
    const newText = e.target.value
    const selectionStart = e.target.selectionStart
    const { suppressUpdateText, text } = this.state

    if ( suppressUpdateText ) {
      this.updateSocialEntry(text)
    }
    else {
      this.setState({ text: newText })
      this.updateSocialEntry(newText)
      this.calculateTags(newText, selectionStart)
    }
  }

  onKeyDown = e => {
    const { tagSuggestions } = this.state
    if ( e.key === 'Enter' && Object.keys(tagSuggestions).length > 0 ) {
      this.setState({ suppressUpdateText: true })
      const firstSuggestion = Object.values(tagSuggestions)[0]
      this.addTag(firstSuggestion)()
    }
  }

  updateSocialEntry = async text => {
    const { updateDraftSocialEntry } = this.props

    await updateDraftSocialEntry( text )
    this.setState({ suppressUpdateText: false })
  }

  onPost = async () => {
    const { postSocialEntry } = this.props

    this.setState({ refreshText: true })

    await postSocialEntry()
  }
  
  close = e => {
    e.preventDefault()

    this.props.toggleVisibility(false)
  }

  render() {
    const { text, draftSocialEntry, tagSuggestions  } = this.state
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
              { (tags || []).map( (t,i) =>
                <div className='social-entry-form__tag' key={ i }>{ t.symbol + t.handle }</div>
              ) }
            </div>
            <ul className='social-entry-form__suggestions'>
              Tag Suggestions:
              { tagSuggestions.map( (t,i) =>
                <li key={ i }
                  className={ 'social-entry-form__suggestions__item--' + (t.taggableType || '').toLowerCase() }
                  onClick={ this.addTag(t) }
                  >
                  { t.symbol + t.handle + ": " + t.name }
                </li>
              ) }
            </ul>
            <input
              className="social-entry-form__submit"
              type="submit" 
              value="Post" 
              onClick={ this.onPost }
            />
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
