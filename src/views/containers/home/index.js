import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Home from '@components/home/index'

import services from '@services'
import coordinators from '@coordinators'

const mapStateToProps = state => {
  return {
    count: state.counter.count,
    isIncrementing: state.counter.isIncrementing,
    isDecrementing: state.counter.isDecrementing,
    // bestAwards: state.bestAwards.all,
  }
}

const mapDispatchToProps = () => {
  const { RestService, CounterService } = services
  const increment = () => CounterService.increment()
  const incrementAsync = () => CounterService.incrementAsync()
  const decrement = () => CounterService.decrement()
  const decrementAsync = () => CounterService.decrementAsync()

  const changePage = () => push('/about-us')

  const suggestYelp = coordinators.suggestYelp({ RestService })
  const loadFoods = coordinators.loadFoods({ RestService })
  const createEntity = coordinators.createEntity({ RestService })

  return {
    increment,
    incrementAsync,
    createEntity,
    decrement,
    decrementAsync,
    changePage,
    loadFoods,
    suggestYelp,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
