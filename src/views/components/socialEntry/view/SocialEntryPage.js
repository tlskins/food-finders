import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SocialEntryItem from '@containers/socialEntry/view/SocialEntryItem'


class SocialEntryPage extends Component {

  renderReplies = SocialEntry => {
    const { metadata } = SocialEntry
    if ( !metadata || !metadata.replies ) {
      return null
    }
    const { replies } = metadata

    return (
      <div>
        { replies.map( (reply,i) => (
          <SocialEntryItem
            feedItem={ reply }
            renderSocialFooter={ true }
          />
        ) ) }
      </div>
    )
  }

  render() {
    const { SocialEntry } = this.props
    if ( !SocialEntry ) {
      return null
    }
    console.log('SocialEntryDetail, SocialEntry=',SocialEntry)

    return (
      <div>
        <SocialEntryItem
          feedItem={ SocialEntry }
          renderSocialFooter={ true }
        />
        { this.renderReplies(SocialEntry) }
      </div>
    )
  }
}

SocialEntryPage.propTypes = {
  SocialEntry: PropTypes.object,
}

export default SocialEntryPage
