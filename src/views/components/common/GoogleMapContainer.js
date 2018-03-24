import React, { Component } from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'


const G_API_KEY = "AIzaSyDOctR1nzFfr2Fdn4pLOplJWWZnoV8nos4"

export class MapContainer extends Component {
  state = {
    center: {},
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  }

  onMapClicked = (mapProps, map, clickEvent) => {
    // console.log('mapclicked, mapProps=',mapProps,' map=',map,' clickEvent=',clickEvent)
    const { showingInfoWindow } = this.state
    if ( showingInfoWindow ) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const { center, activeMarker } = nextProps
  //   if ( center !== this.props.center || activeMarker !== this.props.activeMarker ) {
  //     this.setState({ center, activeMarker })
  //   }
  // }

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
    const { center, google, marker } = this.props
    const { activeMarker, showingInfoWindow } = this.state
    const style = { width: '600px', height: '700px' }

    const markerName = marker && marker.name
    const markerTitle = marker && marker.title

    return (
      <Map
        center={ center }
        google={ google }
        onClick={ this.onMapClicked }
        style={ style }
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

export default GoogleApiWrapper({
  apiKey: (G_API_KEY)
})(MapContainer)