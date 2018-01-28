import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SocialEntryInput extends Component {

  state = {
    text: "",
    tags: [],
    tagSuggestions: [],
    yelpSuggestions: [],
    beginIndex: 0,
    endIndex: 0,
    suppressUpdateText: false,
  }

  componentDidMount() {
    ( async () => {
      const draftSocialEntry = await this.props.loadDraftSocialEntry()
      this.setState({ ...draftSocialEntry })
    })()
  }

  findWordAtCursor = (text, cursorIndex) => {
    let endIndex = text.indexOf(' ',cursorIndex)
    if ( endIndex === -1 ) {
      endIndex = cursorIndex
    }

    let beginIndex = text.slice(0,cursorIndex).lastIndexOf(' ') + 1
    if (beginIndex === -1 || beginIndex > endIndex ) {
      beginIndex = 0
    }

    this.setState({ beginIndex, endIndex })
    return text.slice(beginIndex, endIndex).trim()
  }

  updateSocialEntry = async text => {
    const { updateDraftSocialEntry } = this.props

    const newDraftSocialEntry = await updateDraftSocialEntry( text )
    delete newDraftSocialEntry.text
    this.setState({ ...newDraftSocialEntry, suppressUpdateText: false })
  }

  calculateTags = (text, selectionStart) => {
    const currentWord = this.findWordAtCursor(text, selectionStart)

    if ( currentWord[0] && ["@", "#", "^"].includes(currentWord[0]) ) {
      this.asyncSuggestSetTags(currentWord[0], currentWord.substr(1))
      this.asyncSuggestSetYelp(currentWord.substr(1))
    }
    else {
      this.setState({ tagSuggestions: [] })
    }
  }

  asyncSuggestSetTags = async (symbol, text) => {
    const { suggestTags } = this.props
    const tagSuggestions = await suggestTags({ symbol, text })
    this.setState({ tagSuggestions })
  }

  asyncSuggestSetYelp = async text => {
    const { suggestYelp } = this.props
    const yelpSuggestions = await suggestYelp( text )
    this.setState({ yelpSuggestions })
  }

  aggregateTags = additionalTags => {
    const { tagSuggestions } = this.state
    const allTagHandles = tagSuggestions.map( t => t.handle )
    allTagHandles && additionalTags.forEach( t => {
      if (!allTagHandles.includes(t.handle)) {
        tagSuggestions.push(t)
      }
    })
    return tagSuggestions.sort((a,b) => {
      return b['handle'].toLowerCase() < a['handle'].toLowerCase()
    }).slice(0,4)
  }

  addTag = tag => () => {
    const { symbol, handle } = tag
    let { text, beginIndex, endIndex } = this.state

    this.setState({
      tagSuggestions: [],
      text: text.slice(0, beginIndex) + symbol + handle + text.slice(endIndex),
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

  render() {
    const { text, tags, yelpSuggestions } = this.state
    let { tagSuggestions } = this.state

    if ( yelpSuggestions ) {
      tagSuggestions = this.aggregateTags(yelpSuggestions)
    }

    return (
      <div>
        <textarea type="text"
          value={ text }
          onChange={ this.updateText }
          onKeyDown={ this.onKeyDown }
          />
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
  loadDraftSocialEntry: PropTypes.func,
  suggestTags: PropTypes.func,
  suggestYelp: PropTypes.func,
  updateDraftSocialEntry: PropTypes.func,
}

export default SocialEntryInput
