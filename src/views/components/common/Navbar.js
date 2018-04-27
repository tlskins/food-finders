import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  NavLink,
} from 'react-router-dom'


class NavBar extends Component {
  state = {
    showUserDropdown: false,
  }

  renderProfile = () => {
    const { user, signOut } = this.props
    const { showUserDropdown } = this.state

    if ( !user ) {
      return (
        <div className='main-nav--guest nav-links'>
          <NavLink to="/login"> Sign In </NavLink>
        </div>
      )
    }
    else {
      const { fullName, name, email } = user

      return (
        <div>
          <div className='main-nav--user nav-links' onClick={ () => this.setState({ showUserDropdown: !showUserDropdown })} >
            { name }
          </div>
          { showUserDropdown &&
            <div className='main-nav--user--dropdown'>
              <div className='main-nav--user--dropdown__profile'>
                <div className='main-nav--user--dropdown__profile--name'>
                  { fullName }
                </div>
                <div className='main-nav--user--dropdown__profile--email'>
                  { email }
                </div>
              </div>
              <div className='main-nav--user--dropdown__separator'/>
              <NavLink to="#"> Your Flavor Profile </NavLink>
              <div className='main-nav--user--dropdown__separator'/>
              <NavLink to="#" onClick={ signOut }> Sign Out </NavLink>
            </div>
          }
        </div>
      )
    }
  }

  render() {
    return (
      <nav className='main-nav fb-sticky'>
        <ul className='main-nav--links'>
          <li>
            <NavLink className="nav-links" to="/"> Newsfeed </NavLink>
          </li>
          <li>
            <NavLink className="nav-links" to="#"> Bests </NavLink>
          </li>
          <li>
            <NavLink className="nav-links" to="/hierarchies"> Tag Manager </NavLink>
          </li>
        </ul>
        { this.renderProfile() }
      </nav>
    )
  }
}


NavBar.propTypes = {
  user: PropTypes.object,

  signOut: PropTypes.func,
}


export default NavBar
