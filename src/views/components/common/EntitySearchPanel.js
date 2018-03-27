import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntityPanel from '@components/common/EntityPanel'


class EntitySearchPanel extends Component {
  constructor(props) {
    super(props)
    const { style } = props

    this.state = { style }
  }

  render() {
    const {
      selectedYelpBusiness,
      panelStyle,
      style
    } = this.state

    return (
      <div className="map" style={{ ...style }}>
        <EntityPanel
          showMap={false}
          yelpBusiness={ selectedYelpBusiness }
          panelStyle={ panelStyle }
        />
      </div>
    )
  }
}


EntitySearchPanel.propTypes = {
  style: PropTypes.object,
  panelStyle: PropTypes.object,
}


export default EntitySearchPanel
