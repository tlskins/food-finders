import { connect } from 'react-redux'

import Home from '@components/home/Home'

import services from '@services'


const mapStateToProps = state => {
  const { session, friendsManager } = state
  const { visible } = friendsManager
  const currentUser = session ? session.user : undefined

  return {
    currentUser,
    friendsManagerVisible: visible,
  }
}

const mapDispatchToProps = () => {
  const { RouterService } = services

  const redirect = () => RouterService.replace({ pathname: '/login' })

  return {
    redirect,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
