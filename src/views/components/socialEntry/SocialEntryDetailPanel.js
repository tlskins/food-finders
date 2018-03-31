import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntityPanel from '@components/common/EntityPanel'
import EntitySearchPanel from '@containers/common/EntitySearchPanel'


class SocialEntryDetailPanel extends Component {
  constructor(props) {
    super(props)
    const { mode, style } = props

    this.state = {
      style,
      mode,
      searchText: '',
      yelpBusinesses: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    const {  mode } = nextProps
    this.setState({ mode })
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

  renderEmbeddedTaggable = embeddedTaggable => {
    const { description, synonyms } = embeddedTaggable
    const synonymsString = (synonyms && synonyms.join(', ')) || ''

    return(
      <div className="taggable-section">
        <div className="section-body">
          <span className="bold-attribute">Description: </span> { description }
        </div>
        <div className="section-body">
          <span className="bold-attribute">Synonyms: </span> { synonymsString }
        </div>
      </div>
    )
  }

  renderTaggablePanel = taggable => {
    if ( !taggable ) {
      return null
    }
    const { symbol, name, handle } = taggable

    return (
      <div className="taggable-panel">
        <div className="tag-section">
          <div className="section-hdr">{ symbol + handle }</div>
          <div className="section-body">{ name }</div>
        </div>
        { taggable.embeddedTaggable &&
          this.renderEmbeddedTaggable(taggable.embeddedTaggable)
        }
      </div>
    )
  }

  renderEntityPanel = ({ activeTag, mapStyle, panelStyle }) => {
    const yelpBusiness = this.getActiveYelpBusiness( activeTag )

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

  renderSearchEntityPanel = ({ mapStyle, panelStyle }) => {
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
      tagSymbol,
    } = this.props
    const { mode } = this.state
    const isEntityTag = tagSymbol === '@'

    return (
      <div className="social-entry-detail-panel">
        { isEntityTag && mode === 'DISPLAY ENTITY' &&
          this.renderEntityPanel({ activeTag, mapStyle, panelStyle })
        }
        { isEntityTag && mode === 'SEARCH ENTITY' &&
          this.renderSearchEntityPanel({ mapStyle, panelStyle })
        }
        { !isEntityTag &&
          this.renderTaggablePanel(activeTag)
        }
      </div>
    )
  }
}


SocialEntryDetailPanel.propTypes = {
  // props from redux
  activeTag: PropTypes.object,
  tagSymbol: PropTypes.string,
  // ui props
  mode: PropTypes.string,
  style: PropTypes.object,
  panelStyle: PropTypes.object,
  mapStyle: PropTypes.object,

  toggleMode: PropTypes.func,
}


export default SocialEntryDetailPanel
