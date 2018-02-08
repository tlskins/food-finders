import { connect } from 'react-redux'

import ConfirmEmail from '@components/user/ConfirmEmail'

import services from '@services'
import coordinators from '@coordinators'
// import { HandleError } from '@coordinators/composed'


const mapDispatchToProps = () => {
  const { RestService, RouterService, SessionService, UIService } = services
  const confirmEmail = coordinators.ConfirmEmail({ RestService, RouterService, SessionService, UIService })

  return {
    confirmEmail,
  }
}


export default connect( undefined, mapDispatchToProps )( ConfirmEmail )
