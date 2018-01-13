import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Home from '@components/home/index'

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = () => {
  const changePage = () => push('/about-us')

  return {
    changePage,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
