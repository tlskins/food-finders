import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Sticky, StickyContainer } from 'react-sticky'

import Newsfeed from '@containers/newsfeed/Newsfeed'
import SocialEntryInput from '@containers/socialEntry/SocialEntryInput'
import SocialEntryPage from '@components/socialEntry/view/SocialEntryPage'
import FriendsManager from '@containers/home/FriendsManager'
import NavBar from '@containers/common/Navbar'
import EntityPanel from '@components/common/EntityPanel'
import Header from '@components/home/Header'


class Home extends Component {
  componentWillMount() {
    window.scrollTo(0, 0)
    const { home } = this.props
    this.setState({ ...home })
  }

  componentWillReceiveProps(nextProps) {
    const { loadRootTags, home } = nextProps
    if ( !this.props.currentUser && nextProps.currentUser ) {
      ( async() => await loadRootTags() )()
    }

    if ( this.props.home !== home ) {
      this.setState({ ...home })
    }
  }

  renderStickyHeader = ({ isSticky, style }) => {
    const {
      displayInfoMessage,
      toggleFriendsManagerVisibility,
      friendsManagerVisible,
      currentUser,
      toggleNewsfeed,
    } = this.props
    const { mode } = this.state
    if ( isSticky ) {
      style = { ...style, top: '70px' }
    }
    return (
      <Header
        style={style}
        displayInfoMessage={ displayInfoMessage }
        toggleFriendsManagerVisibility={ () => toggleFriendsManagerVisibility(!friendsManagerVisible) }
        toggleSocialEntryVisibility={ this.onToggleSocialEntryVisibility }
        currentUser={ currentUser }
        mode={ mode }
        toggleToNewsfeed={ toggleNewsfeed }
      />
    )
  }

  renderStickyEntityPanel = selectedEntity => ({ isSticky, style }) => {
    if ( isSticky ) {
      style = { ...style, width: '100%', top: '155px' }
    }
    const yelpBusiness = selectedEntity && selectedEntity.embeddedTaggable

    return (
      <EntityPanel
        showMap={ true }
        style={ style }
        yelpBusiness={ yelpBusiness }
      />
    )
  }

  onToggleSocialEntryVisibility = () => {
    const { socialEntryVisible, toggleFriendsManagerVisibility, toggleSocialEntryVisibility } = this.props
    toggleSocialEntryVisibility(!socialEntryVisible)
    toggleFriendsManagerVisibility(false)
  }

  renderNewsfeed = () => {
    const { friendsManagerVisible, toggleSocialEntryPage, selectNewsfeedItem } = this.props
    const { selectedEntity } = this.state
    let socialContainerClass = "social-container"
    if ( friendsManagerVisible ) {
      socialContainerClass += " show-sidebar"
    }

    return(
      <div className={ socialContainerClass }>
        <Newsfeed
          selectNewsfeedItem={ selectNewsfeedItem }
          clickNewsfeedItem={ toggleSocialEntryPage }
        />
        { selectedEntity &&
          <div className="home-page-entity-container">
            <Sticky topOffset={-70}>
              { this.renderStickyEntityPanel(selectedEntity) }
            </Sticky>
            <div style={{ height: '100%' }}></div>
          </div>
        }
      </div>
    )
  }

  renderSocialEntryPage = () => {
    const { friendsManagerVisible, loadSocialEntryPage } = this.props
    const { clickedNewsfeedItem } = this.state
    let socialContainerClass = "social-container"
    if ( friendsManagerVisible ) {
      socialContainerClass += " show-sidebar"
    }

    return(
      <div className={ socialContainerClass }>
        <SocialEntryPage
          SocialEntry={ clickedNewsfeedItem }
          loadSocialEntryPage={ loadSocialEntryPage }
        />
      </div>
    )
  }

  render() {
    const { socialEntryVisible } = this.props
    const { mode } = this.state

    return (
      <div className='page-container'>
        <NavBar />
        <div className="hero-container">
          <div className="hero-image-large"/>
        </div>
        <StickyContainer>
          <Sticky topOffset={-70}>
            { this.renderStickyHeader }
          </Sticky>
          <div className="home-page">
            <FriendsManager />
            { mode === 'Newsfeed' && this.renderNewsfeed() }
            { mode === 'SocialEntryPage' && this.renderSocialEntryPage() }
            { socialEntryVisible && <SocialEntryInput /> }
          </div>
        </StickyContainer>
      </div>
    )
  }

}

Home.propTypes = {
  home: PropTypes.object,
  actionablesDict: PropTypes.object,
  currentUser: PropTypes.object,
  friendsManagerVisible: PropTypes.bool,
  socialEntryVisible: PropTypes.bool,

  displayInfoMessage: PropTypes.func,
  loadSocialEntryPage: PropTypes.func,
  loadTaggable: PropTypes.func,
  redirect: PropTypes.func,
  selectNewsfeedItem: PropTypes.func,
  toggleFriendsManagerVisibility: PropTypes.func,
  toggleNewsfeed: PropTypes.func,
  toggleSocialEntryPage: PropTypes.func,
  toggleSocialEntryVisibility: PropTypes.func,
}

export default Home
