import { connect } from 'react-redux'

import Home from '@components/home/Home'

import services from '@services'


const mapStateToProps = state => {
  return {
    currentUser: state.session,
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
