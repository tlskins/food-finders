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
  // TODO : move selectedNewsfeedItem, selectedEntity to newsfeed component
  state = {
    mode: 'Newsfeed',
    clickedNewsfeedItem: undefined,
    selectedNewsfeedItem: undefined,
    selectedEntity: undefined,
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  componentWillReceiveProps(nextProps) {
    const { loadRootTags } = nextProps
    if ( !this.props.currentUser && nextProps.currentUser ) {
      ( async() => await loadRootTags() )()
    }
  }

  selectNewsfeedItem = async selectedNewsfeedItem => {
    const { loadTaggable, pTaggableClassToType } = this.props
    let newState = { selectedNewsfeedItem }
    let selectedEntity = undefined
    let entityTag = undefined

    // Find entity tag
    if ( selectedNewsfeedItem && selectedNewsfeedItem.metadata ) {
      const { metadata } = selectedNewsfeedItem
      if ( metadata.foodRating ) {
        entityTag = selectedNewsfeedItem.metadata.foodRating.ratee
      }
      else if ( metadata.tags && metadata.tags.length > 0 ) {
        entityTag = metadata.tags.find( t => t.taggableType === 'Entity' )
      }
    }

    if ( entityTag ) {
      const taggableType = pTaggableClassToType(entityTag.taggableType)
      selectedEntity = await loadTaggable( taggableType, entityTag.handle )
      newState = { ...newState, selectedEntity }
    }
    this.setState( newState )
  }

  clickNewsfeedItem = newsfeedItem => {
    this.setState({
      mode: 'SocialEntryPage',
      selectedNewsfeedItem: undefined,
      selectedEntity: undefined,
      clickedNewsfeedItem: newsfeedItem,
    })
  }

  renderStickyHeader = ({ isSticky, style }) => {
    const {
      displayInfoMessage,
      toggleFriendsManagerVisibility,
      friendsManagerVisible,
      currentUser,
    } = this.props
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
    const { friendsManagerVisible } = this.props
    const { selectedEntity } = this.state
    let socialContainerClass = "social-container"
    if ( friendsManagerVisible ) {
      socialContainerClass += " show-sidebar"
    }

    return(
      <div className={ socialContainerClass }>
        <Newsfeed
          selectNewsfeedItem={ this.selectNewsfeedItem }
          clickNewsfeedItem={ this.clickNewsfeedItem }
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
    const { friendsManagerVisible } = this.props
    const { clickedNewsfeedItem } = this.state
    let socialContainerClass = "social-container"
    if ( friendsManagerVisible ) {
      socialContainerClass += " show-sidebar"
    }

    return(
      <div className={ socialContainerClass }>
        <SocialEntryPage
          SocialEntry={ clickedNewsfeedItem }
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
  actionablesDict: PropTypes.object,
  currentUser: PropTypes.object,
  friendsManagerVisible: PropTypes.bool,
  socialEntryVisible: PropTypes.bool,

  displayInfoMessage: PropTypes.func,
  loadTaggable: PropTypes.func,
  pTaggableClassToType: PropTypes.func,
  redirect: PropTypes.func,
  toggleFriendsManagerVisibility: PropTypes.func,
  toggleSocialEntryVisibility: PropTypes.func,
}

export default Home
