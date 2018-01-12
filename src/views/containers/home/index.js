import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Home from '@components/home/index'

import services from '@services'
import coordinators from '@coordinators'

const mapStateToProps = state => {
  return {
    // count: state.counter.count,
    // isIncrementing: state.counter.isIncrementing,
    // isDecrementing: state.counter.isDecrementing,
  }
}

const mapDispatchToProps = () => {
  const { RestService } = services

  const changePage = () => push('/about-us')

  const suggestYelp = coordinators.suggestYelp({ RestService })
  const loadFoods = coordinators.loadFoods({ RestService })
  const createEntity = coordinators.createEntity({ RestService })

  return {
    createEntity,
    changePage,
    loadFoods,
    suggestYelp,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
