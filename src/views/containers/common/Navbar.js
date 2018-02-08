import { connect } from 'react-redux'

import NavBar from '@components/common/Navbar'

import services from '@services'
import coordinators from '@coordinators'


const mapStateToProps = state => {
  const userName = [ state.session.first_name, state.session.last_name ].filter( o => o ).join( ' ' )

  return {
    userName,
  }
}


const mapDispatchToProps = () => {
  const { RestService, RouterService, SessionService } = services

  const signOut = coordinators.SignOut({ RestService, RouterService, SessionService })

  return {
    signOut,
  }
}


export default connect( mapStateToProps, mapDispatchToProps )( NavBar )
