import React, { Component } from 'react'
import PropTypes from 'prop-types'


class FlashMessage extends Component {
  state = { hide: false }

  componentDidMount() {
    if ( !this.props.options ) {
      this.animationTimer = setTimeout(() => {
        delete this.animationTimer
        this.setState({ hide: true })

        if ( this.props.onHide ) {
          this.hideTimer = setTimeout( this.onHide, 350 )
        }
      }, 5000 )
    }
  }

  onClose = () => {
    if ( this.hideTimer ) {
      clearTimeout( this.hideTimer )
      delete this.hideTimer
    }
    if ( this.animationTimer ) {
      clearTimeout( this.animationTimer )
      delete this.animationTimer
    }

    const { onHide } = this.props
    onHide && onHide()
  }

  onHide = () => {
    const { onHide } = this.props

    delete this.hideTimer

    onHide && onHide()
  }

  render() {
    const { alertType, message, options, top } = this.props
    const { hide } = this.state

    if ( options ) {
      const _buttonAction = options && options.buttonAction
      const buttonAction = e => {
        e.preventDefault()
        e.stopPropagation()

        _buttonAction && _buttonAction()
      }
      const buttonTitle = options && options.buttonTitle

      return (
        <div>
          <div style={ { top } }
            className={ `alert-container__inner alert-${ alertType } ${ hide && 'hide-alert' }` }
            onClick={ this.onClose }
          >
            <span className="close-flash"></span>
            <p>{ message } <button onClick={ buttonAction }>{ buttonTitle }</button></p>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div style={ { top } }
          className={ `alert-container__inner alert-${ alertType } ${ hide && 'hide-alert' }` }
          onClick={ this.onClose }
        >
          <p>{ message }</p>
        </div>
      </div>
    )
  }
}


FlashMessage.propTypes = {
  alertType: PropTypes.string,
  message: PropTypes.string,
  options: PropTypes.object,
  top: PropTypes.number,

  onHide: PropTypes.func,
}


class FlashMessages extends Component {
  renderAlert = ( data, i ) => {
    const onHide = () => {
      this.props.dismissMessage( data.timestamp )
    }

    return (
      <FlashMessage key={ `alert_${ data.timestamp }` }
        alertType={ data.alertType }
        onHide={ onHide }
        message={ data.message }
        options={ data.options }
        top={ 20 + i * 80 }
      />
    )
  }

  render() {
    const { flashMessages } = this.props

    return (
      <div className="alert-container">
        { flashMessages.map(( data, i ) => this.renderAlert( data, i )) }
      </div>
    )
  }
}


FlashMessages.propTypes = {
  flashMessages: PropTypes.arrayOf( PropTypes.shape({
    timestamp: PropTypes.number,
    message: PropTypes.string,
    options: PropTypes.object,
    alertType: PropTypes.string,
  })),

  dismissMessage: PropTypes.func,
}

export default FlashMessages
