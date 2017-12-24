import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import services from '@services'
import coordinators from '@coordinators'
import Select from 'react-select'
import './index.css'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      yelpQuery: '',
    }
    this.yelpSearchHandler = this.yelpSearchHandler.bind(this)
    this.suggestYelp = this.suggestYelp.bind(this)
  }

  yelpSearchHandler = (event) => {
    event.preventDefault()
    this.props.yelpSearch( this.state.yelpQuery )
    this.setState({ yelpQuery: '' })
  }

  suggestYelp(input,callback) {
    if (!input) {
      return Promise.resolve({ options: [] })
    }

    this.props.suggestYelp(input)
    .then( results => {
      console.log('suggestYelp - results = ',results)
      setTimeout(() => {
        callback(null, { options: results} )
      }, 500)

    }).catch(
      e => {
        console.log('error = ',e)
      }
    )
  }

  renderOption(option) {
    console.log('render options called')
    return ( option && option.name &&
      <div>
        <h5>{option && option.name}</h5>
        <p style={{ "font-size": "80%", "color": "#999999"}}>
          <b>Rating: </b>{option && option.rating}<br />
          <b>Price: </b>{option && option.price}<br />
        </p>
      </div>
    )
  }

  render() {
    console.log('renders props = ',this.props)
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

        {
          // <form id="yelpQuery" onSubmit={ this.yelpSearchHandler }>
          //   <input type="text" value={ this.state.yelpQuery } onChange={ (event) => this.setState({ yelpQuery: event.target.value }) } />
          // </form>
        }

        <Select.Async multi={ false }
          value={this.state.yelpQuery}
          onChange={(event) => this.setState({ yelpQuery: event.target.value })}
          onValueClick={() => console.log('clicked!')}
          valueKey="name"
          labelKey="name"
          loadOptions={this.suggestYelp}
          optionRenderer={ this.renderOption }
          backspaceRemoves={ true } />
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    count: state.counter.count,
    isIncrementing: state.counter.isIncrementing,
    isDecrementing: state.counter.isDecrementing,
    suggestedYelpLocations: state.yelp.suggestedLocations,
  }
}

const mapDispatchToProps = () => {
  const { RestService, CounterService, YelpService } = services
  const increment = () => CounterService.increment()
  const incrementAsync = () => CounterService.incrementAsync()
  const decrement = () => CounterService.decrement()
  const decrementAsync = () => CounterService.decrementAsync()
  const yelpSearch = coordinators.searchYelp({ RestService, YelpService })
  const suggestYelp = coordinators.suggestYelp({ RestService })
  const changePage = () => push('/about-us')

  return {
    increment,
    incrementAsync,
    decrement,
    decrementAsync,
    yelpSearch,
    changePage,
    suggestYelp,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
