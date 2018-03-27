import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Sticky, StickyContainer } from 'react-sticky'

import Newsfeed from '@containers/home/Newsfeed'
import SocialEntryInput from '@containers/socialEntry/SocialEntryInput'
import FriendsManager from '@containers/home/FriendsManager'
import NavBar from '@containers/common/Navbar'
import EntityPanel from '@components/common/EntityPanel'
import Header from '@components/home/Header'


class Home extends Component {
  state = {
    selectedNewsfeedItem: undefined,
    selectedEntity: undefined,
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    setTimeout(() => {
      const { currentUser, redirect } = this.props

      if ( !currentUser ) {
        redirect()
      }
    }, 100 )
  }

  componentWillReceiveProps(nextProps) {
    const { loadRootTags, selectedNewsfeedItem, loadTaggable, pTaggableClassToType } = nextProps
    if ( !this.props.currentUser && nextProps.currentUser ) {
      ( async() => await loadRootTags() )()
    }

    if ( this.props.selectNewsfeedItem !== selectedNewsfeedItem ) {
      console.log('selectedNewsfeedItem change detected',selectedNewsfeedItem)
      if ( selectedNewsfeedItem && selectedNewsfeedItem.metadata && selectedNewsfeedItem.metadata.foodRating ) {
        ( async() => {
          const ratee = selectedNewsfeedItem.metadata.foodRating.ratee
          const taggableType = pTaggableClassToType(ratee.taggableType)
          const selectedEntity = await loadTaggable( taggableType, ratee.taggableId )
          console.log('selected entity = ',selectedEntity)
          this.setState({ selectedNewsfeedItem, selectedEntity })
        })()
      }
      else {
        console.log('selected entity = ',undefined)
        this.setState({ selectedNewsfeedItem, selectedEntity: undefined })
      }
    }
  }

  renderStickyHeader = ({ isSticky, style }) => {
    const {
      toggleFriendsManagerVisibility,
      toggleSocialEntryVisibility,
      friendsManagerVisible,
      socialEntryVisible,
    } = this.props
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
  }

  renderStickyEntityPanel = ({ isSticky, style, }) => {
    const { selectedEntity } = this.state
    if ( isSticky ) {
      style = { ...style, width: '100%', top: '155px' }
    }
    // TODO - move to presenter
    const yelpBusiness = selectedEntity && selectedEntity.yelpBusiness
    return (
      <EntityPanel
        showMap={ true }
        style={ style }
        yelpBusiness={ yelpBusiness }
      />
    )
  }

  render() {
    const {
      currentUser,
      friendsManagerVisible,
      socialEntryVisible,
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
            { this.renderStickyHeader }
          </Sticky>
          <div className="home-page">
            <FriendsManager />
              <div className={ socialContainerClass }>
                <Newsfeed />
                <div className="home-page-entity-container">
                  <Sticky topOffset={-70}>
                    { this.renderStickyEntityPanel }
                  </Sticky>
                  <div style={{ height: '100%' }}></div>
                </div>
                { socialEntryVisible && <SocialEntryInput /> }
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
  selectedNewsfeedItem: PropTypes.object,
  socialEntryVisible: PropTypes.bool,

  loadTaggable: PropTypes.func,
  pTaggableClassToType: PropTypes.func,
  redirect: PropTypes.func,
  toggleFriendsManagerVisibility: PropTypes.func,
  toggleSocialEntryVisibility: PropTypes.func,
}

export default Home
