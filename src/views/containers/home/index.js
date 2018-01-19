import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Home from '@components/home/index'

const mapDispatchToProps = () => {
  const changePage = () => push('/about-us')

  return {
    changePage,
  }
}

export default connect(null, mapDispatchToProps)(Home)
