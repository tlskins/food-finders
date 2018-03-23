import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
// import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Sticky, StickyContainer } from 'react-sticky'

import Newsfeed from '@containers/home/Newsfeed'
import SocialEntryInput from '@containers/home/SocialEntryInput'
import FriendsManager from '@containers/home/FriendsManager'
import NavBar from '@containers/common/Navbar'


class Header extends PureComponent {
  render() {
    const isSticky = this.props.distanceFromTop <= 70
    const className = isSticky ? "sticky-header sticky" : "sticky-header"
    return (
      <div className={ className } style={{ ...this.props.style }}>
        <div>Buddies</div>
      </div>
    );
  }
}


class Home extends Component {
  state = {
    headerSticky: false,
  }

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
              return <Header style={style} />
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
}

export default Home
