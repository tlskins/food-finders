import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntitySelect from '@containers/home/EntitySelect'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLocation: null,
      bestAwards: [],
    }

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

        <EntitySelect
          onChange={ this.onSelect }/>

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

Home.propTypes = {
  changePage: PropTypes.func,
  createEntity: PropTypes.func,
  loadFoods: PropTypes.func,
}

export default Home
