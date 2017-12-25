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
      selectedLocation: null,
    }
    this.suggestYelp = this.suggestYelp.bind(this)
    this.onSelect = this.onSelect.bind(this)
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
    const { location, categories } = option
    const locationString = location.address1.concat(', ').concat(location.city).concat(', ').concat(location.state).concat(', ').concat(location.zip_code)
    const categoriesString = categories.map( c => c.title ).join(', ')

    return ( option && option.name &&
      <div>
        <h5>{option && option.name}</h5>
        <p style={{ "fontSize": "80%", "color": "#999999"}}>
          <b>{ locationString }</b><br />
          <b>{ categoriesString }</b><br />
          <b>Rating: </b>{option && option.rating}<br />
          <b>Price: </b>{option && option.price}<br />
        </p>
      </div>
    )
  }

  onSelect(value, event) {
    if(value) {
      this.setState({ selectedLocation: value })
    }
  }

  render() {
    return (
      <div>
        {
          // <h1>Home</h1>
          // <p>Count: {this.props.count}</p>
          //
          // <p>
          //   <button onClick={this.props.increment} disabled={this.props.isIncrementing}>Increment</button>
          //   <button onClick={this.props.incrementAsync} disabled={this.props.isIncrementing}>Increment Async</button>
          // </p>
          //
          // <p>
          //   <button onClick={this.props.decrement} disabled={this.props.isDecrementing}>Decrementing</button>
          //   <button onClick={this.props.decrementAsync} disabled={this.props.isDecrementing}>Decrement Async</button>
          // </p>
          //
          // <p><button onClick={() => this.props.changePage()}>Go to about page via redux</button></p>
        }

        <Select.Async multi={ false }
          onChange={ this.onSelect }
          valueKey="name"
          labelKey="name"
          loadOptions={ this.suggestYelp }
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
    bestAwards: state.bestAwards.all,
  }
}

const mapDispatchToProps = () => {
  const { RestService, CounterService } = services
  const increment = () => CounterService.increment()
  const incrementAsync = () => CounterService.incrementAsync()
  const decrement = () => CounterService.decrement()
  const decrementAsync = () => CounterService.decrementAsync()
  const suggestYelp = coordinators.suggestYelp({ RestService })
  const changePage = () => push('/about-us')

  return {
    increment,
    incrementAsync,
    decrement,
    decrementAsync,
    changePage,
    suggestYelp,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
