import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntitySelect from '@containers/home/EntitySelect'
import FoodSelect from '@containers/home/FoodSelect'
import Newsfeed from '@containers/home/Newsfeed'
import SocialEntryInput from '@containers/home/SocialEntryInput'
import FriendsManager from '@containers/home/FriendsManager'
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

  render() {
    const { currentUser, friendsManagerVisible } = this.props

    if ( !currentUser ) {
      return null
    }

    return (
      <div>
        <NavBar />
        <div className='home-page'>
          <FriendsManager />
          <div className={ 'social-container' + (friendsManagerVisible ? ' show-friends-manager': '')}>
            <Newsfeed />
            <SocialEntryInput />
          </div>
          { /** <EntitySelect onChange={ this.onChange('selectedEntity') }/> **/ }
          { /** <FoodSelect onChange={ this.onChange('selectedFood') }/> **/ }
        </div>
      </div>
    )
  }

}

Home.propTypes = {
  currentUser: PropTypes.object,
  friendsManagerVisible: PropTypes.bool,
  
  redirect: PropTypes.func,
}

export default Home
