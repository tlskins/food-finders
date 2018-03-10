import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  NavLink,
} from 'react-router-dom'


class NavBar extends Component {
  state = {
    showUserDropdown: false,
  }

  render() {
    const {
      signOut,
      email,
      fullName,
      userName,
    } = this.props
    const { showUserDropdown } = this.state

    return (
      <nav className='main-nav'>
        <ul className='main-nav--links'>
          <li>
            <NavLink to="/"> Newsfeed </NavLink>
          </li>
          <li>
            <NavLink to="#"> Bests </NavLink>
          </li>
          <li>
            <NavLink to="/hierarchies"> Tag Manager </NavLink>
          </li>
        </ul>

        <div className='main-nav--user' onClick={ () => this.setState({ showUserDropdown: !showUserDropdown })} >
          { userName }
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
  userName: PropTypes.string,
  email: PropTypes.string,
  fullName: PropTypes.string,

  signOut: PropTypes.func,
}


export default NavBar
