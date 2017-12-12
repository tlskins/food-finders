import React from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import services from '../../../behavior/services'

const Home = props => {
  console.log('home props =',props)
  return (
    <div>
      <h1>Home</h1>
      <p>Count: {props.count}</p>

      <p>
        <button onClick={props.increment} disabled={props.isIncrementing}>Increment</button>
        <button onClick={props.incrementAsync} disabled={props.isIncrementing}>Increment Async</button>
      </p>

      <p>
        <button onClick={props.decrement} disabled={props.isDecrementing}>Decrementing</button>
        <button onClick={props.decrementAsync} disabled={props.isDecrementing}>Decrement Async</button>
      </p>

      <p><button onClick={() => props.changePage()}>Go to about page via redux</button></p>
    </div>
  )
}

const mapStateToProps = state => {
  console.log('mapStateToProps!')

  return {
    count: state.counter.count,
    isIncrementing: state.counter.isIncrementing,
    isDecrementing: state.counter.isDecrementing
  }
}

// const mapDispatchToProps = dispatch => bindActionCreators({
//   increment,
//   incrementAsync,
//   decrement,
//   decrementAsync,
//   changePage: () => push('/about-us')
// }, dispatch)

const mapDispatchToProps = () => {
  const { CounterService } = services
  const changePage = () => push('/about-us')

  const { increment, incrementAsync, decrement, decrementAsync } = CounterService
  console.log('counterservice.dispatch - ', CounterService.dispatch)
  console.log('counterservice.getState - ', CounterService.getState)


  return {
    increment,
    incrementAsync,
    decrement,
    decrementAsync,
    changePage,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home)
