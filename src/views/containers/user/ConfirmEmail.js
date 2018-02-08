import { connect } from 'react-redux'

import ConfirmEmail from '@components/user/ConfirmEmail'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'
// import { HandleError } from '@coordinators/composed'


const mapDispatchToProps = () => {
  const { RestService, RouterService, SessionService, UIService } = services
  const { pResponseGeneric: pResponseUser } = presenters.Api
  const confirmEmail = coordinators.ConfirmEmail({ RestService, RouterService, SessionService, UIService, pResponseUser })

  return {
    confirmEmail,
  }
}


export default connect( undefined, mapDispatchToProps )( ConfirmEmail )
