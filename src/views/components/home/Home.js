import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntitySelect from '@containers/home/EntitySelect'
import FoodSelect from '@containers/home/FoodSelect'
import Newsfeed from '@containers/home/Newsfeed'
import SocialEntryInput from '@containers/home/SocialEntryInput'
import NavBar from '@containers/common/Navbar'


class Home extends Component {
  state = {
    selectedEntity: null,
    selectedFood: null,
  }

  componentDidMount() {
    setTimeout(() => {
      const { currentUser, redirect } = this.props

      if ( !currentUser ) {
        redirect()
      }
    }, 100 )
  }

  onChange = (key) => (value, event) => {
    if(value) {
      const { state } = this
      state[key] = value
      this.setState( state )
    }
  }

  render() {
    const { currentUser } = this.props

    if ( !currentUser ) {
      return null
    }

    return (
      <div>
        <NavBar />
        <Newsfeed />
        <SocialEntryInput />
        { /** <EntitySelect onChange={ this.onChange('selectedEntity') }/> **/ }
        { /** }<FoodSelect onChange={ this.onChange('selectedFood') }/> **/ }
      </div>
    )
  }

}

Home.propTypes = {
  redirect: PropTypes.func,
}

export default Home
