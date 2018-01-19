import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'
import './ReactSelect.css'

class FoodSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadedFoods: [],
      selectedFood: null,
    }
  }

  componentWillMount() {
    const { loadFoods } = this.props

    if ( loadFoods ) {
      loadFoods().then( loadedFoods => {
        this.setState({ loadedFoods })
      }).catch( e => console.log('loadFoods error = ',e))
    }
  }

  renderOption(option) {
    const { name } = option

    return ( option &&
      <div>
        <h5>{ name }</h5>
      </div>
    )
  }

  render() {
    const { onChange } = this.props
    const { loadedFoods, selectedFood } = this.state

    return (
      selectedFood ?
      <div>
        <p>
          <b>{ selectedFood.name }</b>
          <input type="submit" value="X" onClick={ () => this.setState({ selectedFood: null })}/>
        </p>
      </div>
      :
      <div>
        <Select
          placeholder="Choose Food"
          onChange={ (value, event) => {
            this.setState({ selectedFood: value })
            onChange(value, event)
          }}
          valueKey="name"
          labelKey="name"
          options={ loadedFoods }
          optionRenderer={ this.renderOption }
          backspaceRemoves={ true }
          value={ selectedFood }/>
      </div>
    )
  }
}

FoodSelect.propTypes = {
  onChange: PropTypes.func,
  loadFoods: PropTypes.func,
}

export default FoodSelect
