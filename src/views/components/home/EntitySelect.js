import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'
import './EntitySelect.css'

class EntitySelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadedEntities: [],
    }

    this.loadEntities = this.loadEntities.bind(this)
    this.suggestYelp = this.suggestYelp.bind(this)
    this.renderOption = this.renderOption.bind(this)
  }

  suggestYelp(input,callback) {
    if (!input) {
      return Promise.resolve({ options: [] })
    }

    this.props.suggestYelp(input)
    .then( results => {
      console.log('suggestYelp - results = ',results)
      // setTimeout(() => {
        callback(null, { options: results} )
        const businessIds = results.map( r => r["id"] )
        console.log('yelp id results = ',businessIds)
        this.loadEntities(businessIds)
      // }, 50)
    }).catch(
      e => {
        console.log('error Suggesting Yelp= ',e)
      }
    )
  }

  loadEntities(businessIds) {

    // TODO - append loaded entities using dict NOT replace

    this.props.searchEntitiesByBusinessId(businessIds)
    .then( entities => {
      console.log('loaded entity results = ',entities)
      this.setState({ loadedEntities: entities })
    }).catch(
      e => {
        console.log('error loading Entites= ',e)
      }
    )
  }

  renderOption(option) {
    const { location, categories } = option
    const { loadedEntities } = this.state

    const locationString = location.display_address.join(', ')
    const categoriesString = categories.map( c => c.title ).join(', ')
    const foundEntity = loadedEntities.find( e => e.business && e.business.id === option.id )

    return ( option && option.name &&
      <div>
        <h5>{option && option.name}</h5>
        { foundEntity && "Existing Entity!" }
        { foundEntity && foundEntity.vote_totals && foundEntity.vote_totals.map( v => v._id + ' - count : ' + v.count ).join(",") }
        <p style={{ "fontSize": "80%", "color": "#999999"}}>
          <b>{ locationString }</b><br />
          <b>{ categoriesString }</b><br />
          <b>Rating: </b>{option && option.rating}<br />
          <b>Price: </b>{option && option.price}<br />
        </p>
      </div>
    )
  }

  render() {
    const { onChange } = this.props

    return (
      <div>
        <p>Loaded Entities: { this.state.loadedEntities.map( e => e.business && e.business.name ).join(",") }</p>
        <Select.Async multi={ false }
          onChange={ onChange }
          valueKey="name"
          labelKey="name"
          loadOptions={ this.suggestYelp }
          optionRenderer={ this.renderOption }
          backspaceRemoves={ true } />
      </div>
    )
  }
}

EntitySelect.propTypes = {
  onChange: PropTypes.func,
  searchEntitiesByBusinessId: PropTypes.func,
  suggestYelp: PropTypes.func,
}

export default EntitySelect
