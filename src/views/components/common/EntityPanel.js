import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import GoogleMap from '@components/common/GoogleMapContainer'


class EntityPanel extends PureComponent {
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


EntityPanel.propTypes = {
  selectedEntity: PropTypes.object,
  style: PropTypes.object,
}


export default EntityPanel
