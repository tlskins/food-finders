import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  NavLink,
} from 'react-router-dom'


class NavBar extends Component {
  state = {
    showUserDropdown: false,
  }

  renderGuestNav = () => {
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

        <div className='main-nav--guest nav-links'>
          <NavLink to="/login"> Sign In </NavLink>
        </div>
      </nav>
    )
  }

  render() {
    const { user, signOut } = this.props
    if ( !user ) {
      return this.renderGuestNav()
    }
    const { fullName, name, email } = user
    const { showUserDropdown } = this.state

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
      </nav>
    )
  }
}


NavBar.propTypes = {
  user: PropTypes.object,

  signOut: PropTypes.func,
}


export default NavBar
