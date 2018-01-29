import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntitySelect from '@containers/home/EntitySelect'
import FoodSelect from '@containers/home/FoodSelect'
import Newsfeed from '@containers/home/Newsfeed'
import SocialEntryInput from '@containers/home/SocialEntryInput'


class Home extends Component {
  state = {
    selectedEntity: null,
    selectedFood: null,
  }

  onChange = (key) => (value, event) => {
    if(value) {
      const { state } = this
      state[key] = value
      this.setState( state )
    }
  }

  render() {
    return (
      <div>
        <Newsfeed />
        <SocialEntryInput />
        { /** <EntitySelect onChange={ this.onChange('selectedEntity') }/> **/ }
        { /** }<FoodSelect onChange={ this.onChange('selectedFood') }/> **/ }
      </div>
    )
  }

}

Home.propTypes = {
  changePage: PropTypes.func,
}

export default Home
