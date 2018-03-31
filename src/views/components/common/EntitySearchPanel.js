import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntityPanel from '@components/common/EntityPanel'


class EntitySearchPanel extends Component {
  constructor(props) {
    super(props)
    let { panelStyle } = props
    const { style } = props
    panelStyle = panelStyle || { width: '100%' }

    this.state = {
      panelStyle,
      style,
      searchText: '',
      yelpBusinesses: [],
    }
  }

  onChangeSearchText = e => {
    ( async () => {
      const { searchYelpBusinesses } = this.props
      const searchText = e.target.value
      this.setState({ searchText })
      const yelpBusinesses = await searchYelpBusinesses(searchText)
      this.setState({ yelpBusinesses })
    })()
  }

  onAddTagToText = (tag) => {
    const { addTagToText, toggleMode } = this.props
    addTagToText(tag)
    toggleMode('DISPLAY ENTITY')
  }

  render() {
    const {
      panelStyle,
      searchText,
      style,
      yelpBusinesses,
    } = this.state

    return (
      <div className="map" style={{ ...style }}>
        <input
          className="entity-search-input"
          placeholder='Search for a business...'
          type='text'
          value={ searchText }
          onChange={ this.onChangeSearchText }
        />
        <div className="entity-search-results">
          { yelpBusinesses.map( tag =>
            <EntityPanel
              showMap={false}
              yelpBusiness={ tag.yelpBusiness }
              panelStyle={ panelStyle }
              onClick={ () => this.onAddTagToText(tag) }
            />
          ) }
        </div>
      </div>
    )
  }
}


EntitySearchPanel.propTypes = {
  style: PropTypes.object,
  panelStyle: PropTypes.object,

  addTagToText: PropTypes.func,
  searchYelpBusinesses: PropTypes.func,
  toggleMode: PropTypes.func,
}


export default EntitySearchPanel
