import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'
import './ReactSelect.css'

class EntitySelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadedEntities: {},
      selectedBusiness: null,
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
    .then( businesses => {
      // setTimeout(() => {
        callback(null, { options: businesses} )
        const businessIds = businesses.map( r => r["id"] )
        console.log('yelp ids = ',businessIds)
        this.loadEntities(businessIds)
      // }, 50)
    }).catch(
      e => {
        console.log('error Suggesting Yelp= ',e)
      }
    )
  }

  loadEntities(businessIds) {
    console.log('loading entities = ',businessIds)
    businessIds.length > 0 && this.props.searchEntitiesByBusinessId(businessIds)
    .then( entities => {
      console.log('loaded entities = ',entities)
      const { loadedEntities } = this.state
      entities.forEach(entity => {
        if ( entity.business_id ) {
          loadedEntities[entity.business_id] = entity
        }
      })
      this.setState({ loadedEntities })
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
    const foundEntity = loadedEntities[option.id]

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
    const { onChange, createEntity } = this.props
    const { selectedBusiness } = this.state
    const { loadedEntities } = this.state
    const entities = Object.values(loadedEntities)
    let matchingEntity = null
    if ( selectedBusiness && loadedEntities && loadedEntities[selectedBusiness.id] ) {
      matchingEntity = loadedEntities[selectedBusiness.id]
    }

    return (
      selectedBusiness ?
      <div>
        <p>
          <b>{ selectedBusiness.name }</b>
          { matchingEntity && matchingEntity.vote_totals && matchingEntity.vote_totals.map( v => v._id + ': ' + v.count + ' votes').map( v => (
            <div>{v}<br /></div>
          ))}
          <input type="submit" value="X" onClick={ (event) => {
            this.setState({ selectedBusiness: null })
            onChange(null, event)
          }}/>
          <input type="submit" value="+" onClick={ () => createEntity(selectedBusiness) }/>
        </p>
      </div>
      :
      <div>
        <p>Loaded Entities: { entities.map( e => e.business && e.business.name ).join(",") }</p>
        <Select.Async
          placeholder="Choose Entity"
          multi={ false }
          onChange={ (value, event) => {
            this.setState({ selectedBusiness: value })
            onChange(value, event)
          }}
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
  createEntity: PropTypes.func,
  onChange: PropTypes.func,
  searchEntitiesByBusinessId: PropTypes.func,
  suggestYelp: PropTypes.func,
}

export default EntitySelect
