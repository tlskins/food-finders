import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
// import services from '../../../behavior/services'
import services from '@services'
import { bindActionCreators } from 'redux'

class Home extends Component {

  render() {
    return (
      <div>
        <h1>Home</h1>
        <p>Count: {this.props.count}</p>

        <p>
          <button onClick={this.props.increment} disabled={this.props.isIncrementing}>Increment</button>
          <button onClick={this.props.incrementAsync} disabled={this.props.isIncrementing}>Increment Async</button>
        </p>

        <p>
          <button onClick={this.props.decrement} disabled={this.props.isDecrementing}>Decrementing</button>
          <button onClick={this.props.decrementAsync} disabled={this.props.isDecrementing}>Decrement Async</button>
        </p>

        <p><button onClick={() => this.props.changePage()}>Go to about page via redux</button></p>
      </div>
    )
  }

}

const mapStateToProps = state => {
  console.log('mapStateToProps!')

  return {
    count: state.counter.count,
    isIncrementing: state.counter.isIncrementing,
    isDecrementing: state.counter.isDecrementing
  }
}

const mapDispatchToProps = dispatch => {
  const increment = () => services.CounterService.increment()
  const incrementAsync = () => services.CounterService.incrementAsync()
  const decrement = () => services.CounterService.decrement()
  const decrementAsync = () => services.CounterService.decrementAsync()

  return bindActionCreators({
    increment,
    incrementAsync,
    decrement,
    decrementAsync,
    changePage: () => push('/about-us')
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
