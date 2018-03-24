import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Sticky, StickyContainer } from 'react-sticky'

import GoogleMap from '@components/common/GoogleMapContainer'
import Newsfeed from '@containers/home/Newsfeed'
import SocialEntryInput from '@containers/home/SocialEntryInput'
import FriendsManager from '@containers/home/FriendsManager'
import NavBar from '@containers/common/Navbar'
import DropdownArrow from '@res/images/icons8-expand-arrow-48.png'


class Header extends PureComponent {
  render() {
    const {
      toggleFriendsManagerVisibility,
      toggleSocialEntryVisibility,
    } = this.props

    return (
      <div className="sticky-header" style={{ ...this.props.style }}>
        <div className="sticky-sidebar-toggle"
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


class Map extends PureComponent {
  render() {
    const { style } = this.props
    return (
      <div className="map" style={{ ...style }}>
        <GoogleMap />
      </div>
    )
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
  }

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
    let socialContainerClass = "social-container"
    if ( friendsManagerVisible ) {
      socialContainerClass += " show-sidebar"
    }

    return (
      <div className='page-container'>
        <NavBar />
        <div className="hero-container">
          <div className="hero-image-large"/>
        </div>
        <StickyContainer>
          <Sticky topOffset={-70}>
            {({ isSticky, style, }) => {
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
                <div className="home-page-map-container">
                  <Sticky topOffset={-70}>
                    {({ isSticky, style, }) => {
                      if ( isSticky ) {
                        style = { ...style, width: '100%', top: '155px' }
                      }
                      return <Map style={ style } sidebarVisible={ friendsManagerVisible }/>
                    }}
                  </Sticky>
                  <div style={{ height: '100%' }}></div>
                </div>
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
