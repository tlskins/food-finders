import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntityPanel from '@components/common/EntityPanel'
import EntitySearchPanel from '@containers/common/EntitySearchPanel'


class SocialEntryDetailPanel extends Component {
  constructor(props) {
    super(props)
    const { style } = props

    this.state = { style }
  }

  // TODO - move to presenter
  getActiveYelpBusiness = activeTag => {
    if ( activeTag ) {
      if ( activeTag.yelpBusiness ) {
        return activeTag.yelpBusiness
      }
      else if ( activeTag.taggableType === 'Entity' ) {
        return activeTag.embeddedTaggable
      }
    }
    return undefined
  }

  renderEntityPanel = ({ yelpBusiness, mapStyle, panelStyle }) => {
    return (
      <EntityPanel
        yelpBusiness={ yelpBusiness }
        panelStyle={ panelStyle }
        mapStyle={ mapStyle }
        showMap={ true }
      />
    )
  }

  renderSearchPanel = ({ yelpBusiness, mapStyle, panelStyle }) => {
    return (
      <EntitySearchPanel
        panelStyle={ panelStyle }
      />
    )
  }

  render() {
    const {
      activeTag,
      mapStyle,
      panelStyle,
    } = this.props
    const yelpBusiness = this.getActiveYelpBusiness( activeTag )

    return (
      <div className="social-entry-detail-panel">
        { this.renderEntityPanel({ yelpBusiness, mapStyle, panelStyle }) }
      </div>
    )
  }
}


SocialEntryDetailPanel.propTypes = {
  activeTag: PropTypes.object,
  tagSymbol: PropTypes.string,
  searchText: PropTypes.string,
  style: PropTypes.object,
  panelStyle: PropTypes.object,
  mapStyle: PropTypes.object,
}


export default SocialEntryDetailPanel
