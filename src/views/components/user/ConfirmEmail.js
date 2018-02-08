import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ConfirmEmail extends Component {
  componentDidMount() {
    this.props.confirmEmail()
  }

  render() {
    return (
      <div>
        <div>
          <h1> Thanks for joining!</h1>
          <p> You will be redirected to our site shortly</p>
        </div>
      </div>
    )
  }
}


ConfirmEmail.propTypes = {
  confirmEmail: PropTypes.func,
}


export default ConfirmEmail
