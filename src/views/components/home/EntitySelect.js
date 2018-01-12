import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'
import './EntitySelect.css'

class EntitySelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLocation: null,
      bestAwards: [],
    }

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
      setTimeout(() => {
        callback(null, { options: results} )
      }, 50)
    }).catch(
      e => {
        console.log('error = ',e)
      }
    )
  }

  renderOption(option) {
    const { location, categories } = option
    const locationString = location.address1.concat(', ').concat(location.city).concat(', ').concat(location.state).concat(', ').concat(location.zip_code)
    const categoriesString = categories.map( c => c.title ).join(', ')

    return ( option && option.name &&
      <div>
        <h5>{option && option.name}</h5>
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
      <Select.Async multi={ false }
        onChange={ onChange }
        valueKey="name"
        labelKey="name"
        loadOptions={ this.suggestYelp }
        optionRenderer={ this.renderOption }
        backspaceRemoves={ true } />
    )
  }
}

EntitySelect.propTypes = {
  onChange: PropTypes.func,
  suggestYelp: PropTypes.func,
}

export default EntitySelect
