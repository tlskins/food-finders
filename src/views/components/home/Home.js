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


class Map extends PureComponent {
  state = { marker: undefined }

  componentWillReceiveProps(nextProps) {
    const { selectedEntity } = nextProps
    if ( selectedEntity !== this.props.selectedEntity) {
      let marker = undefined
      let mapCenter = {}
      if ( selectedEntity && selectedEntity.yelpBusiness && selectedEntity.yelpBusiness ) {
        const yelp = selectedEntity.yelpBusiness && selectedEntity.yelpBusiness
        const { name, coordinates } = yelp
        const position = { lat: coordinates['latitude'], lng: coordinates['longitude'] }
        mapCenter = { ...position }
        const title = yelp.categories.map( c => c.title ).join(', ')
        marker = { position, name, title }
      }
      this.setState({ mapCenter, marker })
    }
  }

  renderEntityPanel = yelpBusiness => {
    const { price, rating, reviewCount, url, name, categories } = yelpBusiness
    const categoriesString = categories.map( c => c.title ).join(', ')

    return (
      <div className="entity-panel">
        <div className="entity-panel-header item-header">
          <a classNAme="entity_url" href={ url } target="_blank"> { name } </a>
        </div>
        <div className="item-sub-header">
          { categoriesString }
        </div>
        <div className="item-sub-header">
          <span className="bold-attribute">
            Price
          </span>
          <span className="bold-value">
            { ` ${ price }` } •
          </span>
          <span className="bold-attribute">
            Rating
          </span>
          <span className="bold-value">
            { ` ${ rating }` } •
          </span>
          <span className="bold-attribute">
            Review Count
          </span>
          <span className="bold-value">
            { ` ${ reviewCount }` }
          </span>
        </div>
      </div>
    )
  }

  render() {
    const { selectedEntity, style } = this.props
    const { mapCenter, marker } = this.state

    return (
      <div className="map" style={{ ...style }}>
        { selectedEntity && this.renderEntityPanel(selectedEntity.yelpBusiness) }
        <GoogleMap center={ mapCenter } marker={ marker }/>
      </div>
    )
  }
}


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

  renderStickyMap = ({ isSticky, style, }) => {
    const { friendsManagerVisible } = this.props
    const { selectedEntity } = this.state
    if ( isSticky ) {
      style = { ...style, width: '100%', top: '155px' }
    }
    return (
      <div>
        <Map
          style={ style }
          sidebarVisible={ friendsManagerVisible }
          selectedEntity={ selectedEntity }
        />
      </div>
    )
  }

  render() {
    const {
      currentUser,
      friendsManagerVisible,
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
                    { this.renderStickyMap }
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
  selectedNewsfeedItem: PropTypes.object,
  socialEntryVisible: PropTypes.bool,

  loadTaggable: PropTypes.func,
  pTaggableClassToType: PropTypes.func,
  redirect: PropTypes.func,
  toggleFriendsManagerVisibility: PropTypes.func,
  toggleSocialEntryVisibility: PropTypes.func,
}

export default Home
