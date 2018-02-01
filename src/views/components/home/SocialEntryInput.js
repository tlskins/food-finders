import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { findWordAtCursor, searchDictionaryBy } from '~/utils'

class SocialEntryInput extends Component {

  state = {
    text: "",
    searchText: "",
    tags: [],
    tagSuggestions: [],
    tagSymbol: undefined,
    cursorBeginIndex: 0,
    cursorEndIndex: 0,
    suppressUpdateText: false,
  }

  componentDidMount() {
    ( async () => {
      const draftSocialEntry = await this.props.loadDraftSocialEntry()
      this.setState({ ...draftSocialEntry })
    })()
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps !== this.props ) {
      const { tagSymbol, searchText } = this.state
      this.populateTagSuggestions(tagSymbol, searchText)
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

  populateTagSuggestions = (tagSymbol, searchText) => {
    const { entities, hashtags, foods } = this.props

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
      this.populateTagSuggestions(tagSymbol, searchText)

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

    const newDraftSocialEntry = await updateDraftSocialEntry( text )
    delete newDraftSocialEntry.text
    this.setState({ ...newDraftSocialEntry, suppressUpdateText: false })
  }

  onPost = async () => {
    const { postSocialEntry } = this.props

    const newDraftSocialEntry = await postSocialEntry()
    this.setState({ ...newDraftSocialEntry })
  }

  render() {
    const { text, tags, tagSuggestions  } = this.state

    return (
      <div>
        <textarea type="text"
          value={ text }
          onChange={ this.updateText }
          onKeyDown={ this.onKeyDown }
          />
        <br />
        <input type="submit" value="Post" onClick={ this.onPost }/>
        <div>
          Existing Tags:
          { (tags || []).map( (t,i) =>
            <span key={ i }>{ t.symbol + t.handle }</span>
          ) }
        </div>
        <div>
          Tag Suggestions:
          { tagSuggestions.map( (t,i) =>
            <div key={ i }
              onClick={ this.addTag(t) }
              >
              { t.symbol + t.handle + ": " + t.name }
            </div>
          ) }
        </div>
      </div>
    )
  }
}

SocialEntryInput.propTypes = {
  entities: PropTypes.object,
  foods: PropTypes.object,
  hashtags: PropTypes.object,

  addEntities: PropTypes.func,
  addYelpBusinessEntities: PropTypes.func,
  addHashtags: PropTypes.func,
  addFoods: PropTypes.func,
  loadDraftSocialEntry: PropTypes.func,
  postSocialEntry: PropTypes.func,
  searchEntitiesByName: PropTypes.func,
  suggestTags: PropTypes.func,
  suggestYelp: PropTypes.func,
  updateDraftSocialEntry: PropTypes.func,
}

export default SocialEntryInput
