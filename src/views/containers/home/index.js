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
  const changePage = () => push('/about-us')
  const { RestService } = services

  const createEntity = coordinators.createEntity({ RestService })
  const loadFoods = coordinators.loadFoods({ RestService })

  return {
    changePage,
    createEntity,
    loadFoods,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
