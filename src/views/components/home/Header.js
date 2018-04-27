import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import DropdownArrow from '@res/images/icons8-expand-arrow-48.png'


class Header extends PureComponent {
  render() {
    const {
      currentUser,
      style,
      toggleFriendsManagerVisibility,
      toggleSocialEntryVisibility,
    } = this.props

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
        <button className="sticky-header-dropdown">
          <span className="sticky-header-dropdown-title">Sort by - </span>
          <span className="sticky-header-dropdown-value">Topic</span>
          <img className="dropdown-expand-icon" src={ DropdownArrow } alt="dropdown-arrow"/>
        </button>
        <button
          className="header-button"
          onClick={ toggleSocialEntryVisibility }
        >
          New Social Entry
        </button>
      </div> )
  }
}


Header.propTypes = {
  currentUser: PropTypes.object,
  style: PropTypes.object,

  toggleFriendsManagerVisibility: PropTypes.func,
  toggleSocialEntryVisibility: PropTypes.func,
}


export default Header
