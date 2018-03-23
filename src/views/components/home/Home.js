import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
// import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Sticky, StickyContainer } from 'react-sticky'

import Newsfeed from '@containers/home/Newsfeed'
import SocialEntryInput from '@containers/home/SocialEntryInput'
import FriendsManager from '@containers/home/FriendsManager'
import NavBar from '@containers/common/Navbar'
import DropdownArrow from '@res/images/icons8-expand-arrow-48.png'


class Header extends PureComponent {
  render() {
    const {
      distanceFromTop,
      toggleFriendsManagerVisibility,
      toggleSocialEntryVisibility,
    } = this.props
    const isSticky = distanceFromTop <= 70
    const className = isSticky ? "sticky-header sticky" : "sticky-header"

    return (
      <div className={ className } style={{ ...this.props.style }}>
        <div className="sticky-sidebar-header"
          onClick={ toggleFriendsManagerVisibility }
        >
          Buddies
        </div>
        <div className="sticky-header-title">Newsfeed</div>
        <button className="sticky-header-dropdown">
          <span className="sticky-header-dropdown-title">Sort by -</span>
          <span className="sticky-header-dropdown-value">Topic</span>
          <img className="dropdown-expand-icon" src={ DropdownArrow } alt="dropdown-arrow"/>
        </button>
        <button
          className="sticky-header-button"
          onClick={ toggleSocialEntryVisibility }
        >
          New Social Entry
        </button>
      </div> )
  }
}


class Home extends Component {
  componentDidMount() {
    setTimeout(() => {
      const { currentUser, redirect } = this.props

      if ( !currentUser ) {
        redirect()
      }
    }, 100 )
  }

  componentWillReceiveProps(nextProps) {
    const { loadRootTags } = this.props
    if ( !this.props.currentUser && nextProps.currentUser ) {
      ( async() => await loadRootTags() )()
    }
    // if ( nextProps.socialEntryVisible && !this.props.socialEntryVisible ) {
    //   disableBodyScroll( document.querySelector('.social-container') )
    // }
    // else if ( !nextProps.socialEntryVisible && this.props.socialEntryVisible ) {
    //   enableBodyScroll( document.querySelector('.social-container') )
    // }
  }

  // componentWillUnmount() {
  //   clearAllBodyScrollLocks()
  // }

  render() {
    const {
      currentUser,
      friendsManagerVisible,
      socialEntryVisible,
      toggleFriendsManagerVisibility,
      toggleSocialEntryVisibility,
    } = this.props
    if ( !currentUser ) {
      return null
    }
    const socialContainerClass = friendsManagerVisible ? 'social-container show-friends-manager' : 'social-container'

    return (
      <div className='page-container'>
        <NavBar />
        <div className="hero-container">
          <div className="hero-image-large"/>
        </div>
        <StickyContainer>
          <Sticky topOffset={-70}>
            {({
              isSticky,
              wasSticky,
              style,
              distanceFromTop,
              distanceFromBottom,
              calculatedHeight
            }) => {
              if ( isSticky ) {
                style = { ...style, top: '70px' }
              }
              return (
                <Header
                  style={style}
                  toggleFriendsManagerVisibility={ () => toggleFriendsManagerVisibility(!friendsManagerVisible) }
                  toggleSocialEntryVisibility={ () => toggleSocialEntryVisibility(!socialEntryVisible)}
                />
              )
            }}
          </Sticky>
          <div className="home-page">
            <FriendsManager />
            <div className={ socialContainerClass }>
              <Newsfeed />
              <SocialEntryInput />
            </div>
          </div>
        </StickyContainer>
      </div>
    )
  }

}

Home.propTypes = {
  currentUser: PropTypes.object,
  friendsManagerVisible: PropTypes.bool,
  socialEntryVisible: PropTypes.bool,

  redirect: PropTypes.func,
  toggleFriendsManagerVisibility: PropTypes.func,
  toggleSocialEntryVisibility: PropTypes.func,
}

export default Home
