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
        <div className="sticky-header-title">Social Entry View</div>
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

  displayInfoMessage: PropTypes.func,
  toggleFriendsManagerVisibility: PropTypes.func,
  toggleSocialEntryVisibility: PropTypes.func,
  toggleToNewsfeed: PropTypes.func,
}


export default Header
