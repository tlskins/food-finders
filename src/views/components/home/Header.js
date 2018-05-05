import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import DropdownArrow from '@res/images/icons8-expand-arrow-48.png'


class Header extends PureComponent {
  toggleSocialEntryVisibility = () => {
    const {
      currentUser,
      toggleSocialEntryVisibility,
      displayInfoMessage,
    } = this.props

    if ( currentUser ) {
      toggleSocialEntryVisibility && toggleSocialEntryVisibility()
    }
    else {
      displayInfoMessage && displayInfoMessage('Create an account before you can start socializing with your buds!')
    }
  }

  renderNewsfeedHeader = props => {
    const {
      currentUser,
      displayInfoMessage,
      style,
      toggleFriendsManagerVisibility,
    } = props

    return (
      <div className="sticky-header" style={{ ...style }}>
        { currentUser &&
          <div className="sticky-sidebar-toggle"
            onClick={ toggleFriendsManagerVisibility }
          >
            Buddies
          </div>
        }
        <div className="sticky-header-title">Newsfeed</div>
        <button className="sticky-header-dropdown"
          onClick={ () => displayInfoMessage('Sorting coming soon!') }
        >
          <span className="sticky-header-dropdown-title">Sort by - </span>
          <span className="sticky-header-dropdown-value">Topic</span>
          <img className="dropdown-expand-icon" src={ DropdownArrow } alt="dropdown-arrow"/>
        </button>
        <button
          className="header-button"
          onClick={ this.toggleSocialEntryVisibility }
        >
          New Social Entry
        </button>
      </div>
    )
  }

  renderSocialEntryPageHeader = props => {
    const {
      currentUser,
      style,
      toggleFriendsManagerVisibility,
      toggleToNewsfeed,
      socialEntry,
      loadSocialEntryPage,
    } = props
    const parentSocialEntryId = socialEntry.metadata && socialEntry.metadata.parentSocialEntry && socialEntry.metadata.parentSocialEntry.id

    return (
      <div className="sticky-header" style={{ ...style }}>
        { currentUser &&
          <div className="sticky-sidebar-toggle"
            onClick={ toggleFriendsManagerVisibility }
          >
            Buddies
          </div>
        }
        <div className="sticky-header-title">Social Entry View</div>
        { parentSocialEntryId &&
          <button
            className="header-button"
            onClick={ () => loadSocialEntryPage(parentSocialEntryId) }
          >
            Back to Previous Entry
          </button>
        }
        <button
          className="header-button"
          onClick={ toggleToNewsfeed }
        >
          Newsfeed
        </button>
      </div>
    )
  }

  render() {
    const { mode } = this.props

    if ( mode === 'Newsfeed' ) {
      return this.renderNewsfeedHeader(this.props)
    }
    else if ( mode === 'SocialEntryPage' ) {
      return this.renderSocialEntryPageHeader(this.props)
    }
    else {
      return null
    }
  }
}


Header.propTypes = {
  currentUser: PropTypes.object,
  style: PropTypes.object,
  mode: PropTypes.string,
  clickedNewsfeedItem: PropTypes.object,

  displayInfoMessage: PropTypes.func,
  loadSocialEntryPage: PropTypes.func,
  toggleFriendsManagerVisibility: PropTypes.func,
  toggleSocialEntryVisibility: PropTypes.func,
  toggleToNewsfeed: PropTypes.func,
}


export default Header
