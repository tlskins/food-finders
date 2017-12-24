import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import services from '@services'
import coordinators from '@coordinators'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      yelpQuery: '',
    }
    this.yelpSearchHandler = this.yelpSearchHandler.bind(this)
  }

  yelpSearchHandler = (event) => {
    event.preventDefault()
    this.props.yelpSearch( this.state.yelpQuery )
    this.setState({ yelpQuery: '' })
  }

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

        <form id="yelpQuery" onSubmit={ this.yelpSearchHandler }>
          <input type="text" value={ this.state.yelpQuery } onChange={ (event) => this.setState({ yelpQuery: event.target.value }) } />
        </form>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    count: state.counter.count,
    isIncrementing: state.counter.isIncrementing,
    isDecrementing: state.counter.isDecrementing
  }
}

const mapDispatchToProps = () => {
  const { RestService, CounterService } = services
  const increment = () => CounterService.increment()
  const incrementAsync = () => CounterService.incrementAsync()
  const decrement = () => CounterService.decrement()
  const decrementAsync = () => CounterService.decrementAsync()
  const yelpSearch = coordinators.searchYelp({ RestService })
  const changePage = () => push('/about-us')

  return {
    increment,
    incrementAsync,
    decrement,
    decrementAsync,
    yelpSearch,
    changePage,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
