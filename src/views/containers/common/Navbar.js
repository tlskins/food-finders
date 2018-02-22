import { connect } from 'react-redux'

import NavBar from '@components/common/Navbar'

import services from '@services'
import coordinators from '@coordinators'


const mapStateToProps = state => {
  const { user } = state.session
  const { firstName, lastName, name, email } = user
  const fullName = [ firstName, lastName ].filter( o => o ).join( ' ' )

  return {
    userName: name,
    email,
    fullName,
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
