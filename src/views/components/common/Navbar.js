import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  NavLink,
} from 'react-router-dom'
import {
  Dropdown,
  Glyphicon,
  MenuItem,
} from 'react-bootstrap'


class NavBar extends Component {
  render() {
    const {
      signOut,
      userName,
    } = this.props

    return (
      <nav>
        <ul>
          <li>
            <NavLink to="/"> Newsfeed </NavLink>
          </li>
        </ul>

        <ul>
          <Dropdown>
            <Dropdown.Toggle style={ { borderColor: 'transparent' } }>
              <Glyphicon glyph="user" /> { userName } </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem onSelect={ signOut }> Sign Out </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </ul>
      </nav>
    )
  }
}


NavBar.propTypes = {
  userName: PropTypes.string,

  signOut: PropTypes.func,
}


export default NavBar
