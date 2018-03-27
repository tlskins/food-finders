import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'


const G_API_KEY = "AIzaSyDOctR1nzFfr2Fdn4pLOplJWWZnoV8nos4"

export class MapContainer extends Component {
  state = {
    center: {},
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  }

  onMapClicked = (mapProps, map, clickEvent) => {
    const { showingInfoWindow } = this.state
    if ( showingInfoWindow ) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }

  renderMarker = marker => {
    const { title, name, position } = marker

    return  <Marker
      title={ title }
      name={ name }
      position={ position }
      onClick={ this.onMarkerClick }
    />
  }

  render() {
    const { center, google, marker, style } = this.props
    const { activeMarker, showingInfoWindow } = this.state
    const mapStyle = style || { width: '600px', height: '550px' }

    const markerName = marker && marker.name
    const markerTitle = marker && marker.title

    return (
      <Map
        center={ center }
        google={ google }
        onClick={ this.onMapClicked }
        style={ mapStyle }
        zoom={16}
      >
        { marker && this.renderMarker(marker) }
        <InfoWindow marker={ activeMarker } visible={showingInfoWindow}>
          <div>
            <div className="gm-info-window-header"> { markerName } </div>
            <div className="gm-info-window-sub-header"> { markerTitle } </div>
          </div>
        </InfoWindow>
      </Map> )
  }
}


MapContainer.propTypes = {
  center: PropTypes.object,
  google: PropTypes.object,
  marker: PropTypes.object,
  style: PropTypes.object,
}


export default GoogleApiWrapper({
  apiKey: (G_API_KEY)
})(MapContainer)
