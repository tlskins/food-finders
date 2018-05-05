import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SocialEntryItem from '@containers/socialEntry/view/SocialEntryItem'


class SocialEntryPage extends Component {
  renderReplies = ({ SocialEntry, loadSocialEntryPage }) => {
    const { metadata } = SocialEntry
    if ( !metadata || !metadata.replies ) {
      return null
    }
    const { replies } = metadata
    console.log('replies=',replies)

    return (
      <div className="social-entry-replies-container">
        { replies.map( (reply,i) => (
          <div className="newsfeed-item" key={i}>
            <SocialEntryItem
              item={ reply }
              renderSocialFooter={ true }
              onClick={ () => loadSocialEntryPage(reply.metadata.actionableId) }
            />
          </div>
        ) ) }
      </div>
    )
  }

  render() {
    const { SocialEntry, loadSocialEntryPage } = this.props
    if ( !SocialEntry ) {
      return null
    }

    return (
      <div className="social-entry-page">
        <SocialEntryItem
          item={ SocialEntry }
          renderSocialFooter={ true }
        />
        { this.renderReplies({ SocialEntry, loadSocialEntryPage }) }
      </div>
    )
  }
}

SocialEntryPage.propTypes = {
  SocialEntry: PropTypes.object,

  loadSocialEntryPage: PropTypes.func,
}

export default SocialEntryPage
