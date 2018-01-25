import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'
import './ReactSelect.css'

class SocialEntryInput extends Component {

  state = {
    text: "",
  }

  componentDidMount() {
    ( async () => {
      const draftSocialEntry = await this.props.loadDraftSocialEntry()
      console.log('draftSocialEntry = ',draftSocialEntry)
      this.setState({ ...draftSocialEntry })
    })()
  }

  updateText = async text => {
    console.log('newDraftSocialEntry updateText text=',text)

    const { updateDraftSocialEntry } = this.props

    this.setState({ text })
    const newDraftSocialEntry = await updateDraftSocialEntry( text )
    console.log('newDraftSocialEntry =',newDraftSocialEntry)
    delete newDraftSocialEntry.text

    this.setState({ ...newDraftSocialEntry })
  }


  render() {
    const { text, tags } = this.state

    return (
      <div>
        <textarea type="text" name="socialEntryText"
          value={ text }
          onChange={ e => this.updateText(e.target.value) }
          />
        <div>
          Existing Tags:
          { (tags || []).map( t =>
            <span>{ t.symbol + t.handle }</span>
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
  updateDraftSocialEntry: PropTypes.func,
}

export default SocialEntryInput
