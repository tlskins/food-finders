import { connect } from 'react-redux'

import FlashMessages from '@components/common/FlashMessages'

import services from '@services'


const mapStateToProps = state => {
  const { flashMessages } = state.flashMessage

  return { flashMessages }
}


const mapDispatchToProps = () => {
  const { UIService } = services
  const dismissMessage = timestamp => UIService.FlashMessage.dismissMessage( timestamp )

  return { dismissMessage }
}


export default connect( mapStateToProps, mapDispatchToProps )( FlashMessages )
