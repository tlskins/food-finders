import React, { Component } from 'react'
import PropTypes from 'prop-types'

import GoogleMap from '@components/common/GoogleMapContainer'


class EntityPanel extends Component {
  constructor(props) {
    super(props)
    const { mapStyle, panelStyle, style } = props

    this.state = {
      mapStyle,
      panelStyle,
      style,
      marker: undefined,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { yelpBusiness, style } = nextProps
    let newState = undefined
    if ( yelpBusiness !== this.props.yelpBusiness) {
      let marker = undefined
      let mapCenter = {}
      if ( yelpBusiness  ) {
        const { categories, name, coordinates } = yelpBusiness
        const position = { lat: coordinates['latitude'], lng: coordinates['longitude'] }
        mapCenter = { ...position }
        const title = categories.map( c => c.title ).join(', ')
        marker = { position, name, title }
      }
      newState = { mapCenter, marker, yelpBusiness }
      // this.setState({ mapCenter, marker, yelpBusiness })
    }
    if ( style !== this.props.style ) {
      newState = { ...newState, style }
    }

    if ( newState ) {
      this.setState( newState )
    }
  }

  renderEntityPanel = (yelpBusiness, panelStyle) => {
    const {
      location,
      price,
      rating,
      reviewCount,
      url,
      name,
      categories
    } = yelpBusiness
    const categoriesString = categories.map( c => c.title ).join(', ')
    const locationString = location.displayAddress.join(', ')

    return (
      <div className="entity-panel" style={ panelStyle }>
        <div className="entity-panel-header item-header">
          <a className="entity_url" href={ url } target="_blank"> { name } </a>
        </div>
        <div className="item-sub-header">
          { locationString }
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
    const { mapCenter, marker, yelpBusiness, mapStyle, panelStyle, style } = this.state

    return (
      <div className="map" style={{ ...style }}>
        { yelpBusiness && this.renderEntityPanel(yelpBusiness, panelStyle) }
        <GoogleMap center={ mapCenter } marker={ marker } style={ mapStyle }/>
      </div>
    )
  }
}


EntityPanel.propTypes = {
  yelpBusiness: PropTypes.object,
  style: PropTypes.object,
  mapStyle: PropTypes.object,
  panelStyle: PropTypes.object,
}


export default EntityPanel
