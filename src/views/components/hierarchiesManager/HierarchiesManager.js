import React, { Component } from 'react'
import PropTypes from 'prop-types'

import NavBar from '@containers/common/Navbar'

class HierarchiesManager extends Component {

  render() {
    const { currentUser } = this.props

    if ( !currentUser ) {
      return null
    }

    return (
      <div>
        <NavBar />
        <div className={ 'hierarchies-manager-page' }>
          <div>
            Hierarchies Manager
          </div>
        </div>
      </div>
    )
  }

}

HierarchiesManager.propTypes = {
  currentUser: PropTypes.object,
  // friendsManagerVisible: PropTypes.bool,
  // socialEntryVisible: PropTypes.bool,
  //
  // redirect: PropTypes.func,
}

export default HierarchiesManager
