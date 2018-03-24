import React, { Component } from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'


const G_API_KEY = "AIzaSyDOctR1nzFfr2Fdn4pLOplJWWZnoV8nos4"

export class MapContainer extends Component {
  mapClicked = (mapProps, map, clickEvent) => {
    console.log('mapclicked, mapProps=',mapProps,' map=',map,' clickEvent=',clickEvent)
  }

  render() {
    const { google } = this.props
    const style = { width: '600px', height: '800px' }

    return (
      <Map
        google={ google }
        onClick={ this.mapClicked }
        style={ style }
        zoom={14}
      >
        <Marker
          onClick={this.onMarkerClick}
          name="Current Location"
        />

        <InfoWindow onClose={ this.onInfoWindowClose }>
          <div>
            <h1> MAP </h1>
          </div>
        </InfoWindow>
      </Map> )
  }
}

export default GoogleApiWrapper({
  apiKey: (G_API_KEY)
})(MapContainer)
