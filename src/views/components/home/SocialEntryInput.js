import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SocialEntryInput extends Component {

  state = {
    text: "",
    tags: [],
    tagSuggestions: [],
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

  suggestTags = async (text, selectionStart) => {
    const currentWord = this.findWordAtCursor(text, selectionStart)
    console.log('currentWord=',currentWord)

    if ( currentWord[0] && ["@", "#", "^"].includes(currentWord[0]) ) {
      const { suggestTags } = this.props
      const tagSuggestions = await suggestTags({ symbol: currentWord[0], text: currentWord.substr(1) })
      this.setState({ tagSuggestions })
    }
    else {
      this.setState({ tagSuggestions: [] })
    }
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
      this.suggestTags(newText, selectionStart)
    }
  }

  onKeyDown = e => {
    const { tagSuggestions } = this.state
    if ( e.key === 'Enter' && tagSuggestions.length > 0 ) {
      this.setState({ suppressUpdateText: true })
      this.addTag(tagSuggestions[0])()
    }
  }

  render() {
    const { text, tags, tagSuggestions } = this.state

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
          { (tagSuggestions || []).map( (t,i) =>
            <div key={ i }
              onClick={ this.addTag(t) }
              >
              { t.symbol + t.handle }
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
  updateDraftSocialEntry: PropTypes.func,
}

export default SocialEntryInput
