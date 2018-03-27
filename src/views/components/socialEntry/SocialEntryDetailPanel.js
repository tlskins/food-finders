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
      mapStyle,
      panelStyle,
    } = this.props
    const {
      selected,
    } = this.state

    return (
      <div className="social-entry-detail-panel">
        { this.renderEntityPanel({ selected, mapStyle, panelStyle }) }
      </div>
    )
  }
}


SocialEntryDetailPanel.propTypes = {
  style: PropTypes.object,
  panelStyle: PropTypes.object,
  mapStyle: PropTypes.object,
}


export default SocialEntryDetailPanel
