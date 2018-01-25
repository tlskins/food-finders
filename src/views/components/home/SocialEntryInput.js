import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'
import './ReactSelect.css'

class SocialEntryInput extends Component {

  state = {
    text: "",
    tagSuggestions: [],
  }

  componentDidMount() {
    ( async () => {
      const draftSocialEntry = await this.props.loadDraftSocialEntry()
      console.log('draftSocialEntry = ',draftSocialEntry)
      this.setState({ ...draftSocialEntry })
    })()
  }

  findWordAtCursor = (text, cursorIndex) => {
    let endIndex = text.indexOf(' ',cursorIndex)
    if ( endIndex === -1 ) {
      endIndex = cursorIndex
    }

    let beginIndex = text.slice(0,cursorIndex).lastIndexOf(' ')
    if (beginIndex === -1 || beginIndex > endIndex ) {
      beginIndex = 0
    }

    return text.slice(beginIndex, endIndex).trim()
  }

  updateText = async text => {
    const { updateDraftSocialEntry } = this.props

    this.setState({ text })
    const newDraftSocialEntry = await updateDraftSocialEntry( text )
    delete newDraftSocialEntry.text
    this.setState({ ...newDraftSocialEntry })
  }

  suggestTags = async (text, selectionStart) => {

    const currentWord = this.findWordAtCursor(text, selectionStart)
    console.log('suggestTags - currentWord = ',currentWord)

    if ( currentWord[0] && ["@", "#", "^"].includes(currentWord[0]) ) {
      const { suggestTags } = this.props
      const tags = await suggestTags({ symbol: currentWord[0], text: currentWord.substr(1) })
      console.log('suggestTags - found tags = ',tags)
    }
  }

  updateSocialEntry = e => {
    const text = e.target.value
    const selectionStart = e.target.selectionStart
    console.log('suggestTags - text = ',text)


    this.updateText(text)
    this.suggestTags(text, selectionStart)
  }


  render() {
    const { text, tags } = this.state

    return (
      <div>
        <textarea type="text" name="socialEntryText"
          value={ text }
          onChange={ this.updateSocialEntry }
          />
        <div>
          Existing Tags:
          { (tags || []).map( (t,i) =>
            <span key={ i }>{ t.symbol + t.handle }</span>
          ) }
        </div>
        <div>
          Option 1
        </div>
        <div>
          Option 2
        </div>
        <div>
          Option 3
        </div>
        <div>
          Option 4
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
