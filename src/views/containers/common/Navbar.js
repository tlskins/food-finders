import { connect } from 'react-redux'

import NavBar from '@components/common/Navbar'

import services from '@services'
import coordinators from '@coordinators'


const mapStateToProps = state => {
  const { user } = state.session

  return { user }
}


const mapDispatchToProps = () => {
  const { RestService, RouterService, SessionService, UIService } = services

  const signOut = coordinators.SignOut({ RestService, RouterService, SessionService })
  const displayInfoMessage = message => UIService.FlashMessage.displayInfoMessage(message)

  return {
    displayInfoMessage,
    signOut,
  }
}


export default connect( mapStateToProps, mapDispatchToProps )( NavBar )
