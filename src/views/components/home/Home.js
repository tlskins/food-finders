import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

import Newsfeed from '@containers/home/Newsfeed'
import SocialEntryInput from '@containers/home/SocialEntryInput'
import FriendsManager from '@containers/home/FriendsManager'
import NavBar from '@containers/common/Navbar'


class Home extends Component {
  state = {
    headerSticky: false,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true)
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

  componentWillUnmount() {
    // clearAllBodyScrollLocks()
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = e => {
    console.log('onsticky!, e =',e)
    if ( this.header ) {
      const sticky = this.header.offsetTop
      console.log('onsticky!, window.pageYOffset=',window.pageYOffset)
      console.log('onsticky!, sticky - 68 = ',sticky - 68)
      if ( window.pageYOffset >= (sticky - 68) && window.pageYOffset > 459 ) {
        this.setState({ headerSticky: true })
      } else {
        this.setState({ headerSticky: false })
      }
    }
  }

  render() {
    const { currentUser, friendsManagerVisible } = this.props
    const { headerSticky } = this.state
    if ( !currentUser ) {
      return null
    }
    
    let stickyHeaderClass = "sticky-header"
    let homePageClass = "home-page"

    if ( headerSticky ) {
      stickyHeaderClass += " sticky"
      homePageClass += " sticky-content"
    }

    return (
      <div className='page-container'>
        <NavBar />
        <div className="hero-container">
          <div className="hero-image-large"/>
        </div>
        <div className={ stickyHeaderClass }
          ref={ref => this.header = ref }
        >
          <div>Buddies</div>
        </div>
        <div className={ homePageClass }>
          <FriendsManager />
          <div className={ 'social-container' + (friendsManagerVisible ? ' show-friends-manager': '')}>
            <Newsfeed />
            <SocialEntryInput />
          </div>
        </div>
      </div>
    )
  }

}

Home.propTypes = {
  currentUser: PropTypes.object,
  friendsManagerVisible: PropTypes.bool,
  socialEntryVisible: PropTypes.bool,

  redirect: PropTypes.func,
}

export default Home
