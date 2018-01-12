import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'
import './index.css'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLocation: null,
      bestAwards: [],
    }

    this.suggestYelp = this.suggestYelp.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  componentWillMount() {
    const { loadFoods } = this.props

    if ( loadFoods ) {
      loadFoods().then( results => {
        console.log('bestaward results = ',results)
        this.setState({ bestAwards: results })
      }).catch( e => console.log('loadFoods error = ',e))
    }
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

  onSelect(value, event) {
    if(value) {
      this.setState({ selectedLocation: value })
    }
  }

  render() {
    const { selectedLocation, bestAwards } = this.state
    const { createEntity } = this.props

    return (
      <div>
        <p>
          Available Best Awards: { bestAwards && bestAwards.map( a => a.name ).join(', ') }
        </p>

        <Select.Async multi={ false }
          onChange={ this.onSelect }
          valueKey="name"
          labelKey="name"
          loadOptions={ this.suggestYelp }
          optionRenderer={ this.renderOption }
          backspaceRemoves={ true } />

        { selectedLocation &&
          <div>
            <p>
              <b>{ selectedLocation.name }</b>
              <input type="submit" value="X" onClick={ () => this.setState({ selectedLocation: null })}/>
              <input type="submit" value="+" onClick={ () => createEntity(selectedLocation) }/>
            </p>
          </div>
        }

      </div>
    )
  }

}

export default Home
