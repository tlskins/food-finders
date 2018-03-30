import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntityPanel from '@components/common/EntityPanel'
import EntitySearchPanel from '@containers/common/EntitySearchPanel'


class SocialEntryDetailPanel extends Component {
  constructor(props) {
    super(props)
    const { style } = props

    this.state = {
      style,
      mode: 'DISPLAY ENTITY',
      searchText: '',
      yelpBusinesses: [],
    }
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
      <div>
        <button
          onClick={ () => this.setState({ mode: 'SEARCH ENTITY' }) }
          className="social-entry-dtl-hdr-btn"
        >
          Search
        </button>
        <EntityPanel
          yelpBusiness={ yelpBusiness }
          panelStyle={ panelStyle }
          mapStyle={ mapStyle }
          showMap={ true }
        />
      </div>
    )
  }

  renderSearchEntityPanel = ({ yelpBusiness, mapStyle, panelStyle }) => {
    return (
      <div>
        <button
          onClick={ () => this.setState({ mode: 'DISPLAY ENTITY' }) }
          className="social-entry-dtl-hdr-btn active-header-button"
        >
          Details
        </button>
        <EntitySearchPanel
          panelStyle={ panelStyle }
        />
      </div>
    )
  }

  render() {
    const {
      activeTag,
      mapStyle,
      panelStyle,
    } = this.props
    const { mode } = this.state
    const yelpBusiness = this.getActiveYelpBusiness( activeTag )

    return (
      <div className="social-entry-detail-panel">
        { mode === 'DISPLAY ENTITY' &&
          this.renderEntityPanel({ yelpBusiness, mapStyle, panelStyle })
        }
        { mode === 'SEARCH ENTITY' &&
          this.renderSearchEntityPanel({ yelpBusiness, mapStyle, panelStyle })
        }
      </div>
    )
  }
}


SocialEntryDetailPanel.propTypes = {
  // props from redux
  text: PropTypes.string,
  cursorBeginIndex: PropTypes.number,
  cursorEndIndex: PropTypes.number,
  activeTag: PropTypes.object,
  tagSymbol: PropTypes.string,
  // ui props
  style: PropTypes.object,
  panelStyle: PropTypes.object,
  mapStyle: PropTypes.object,
}


export default SocialEntryDetailPanel
