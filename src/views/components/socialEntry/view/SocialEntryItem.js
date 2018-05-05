import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Moment from 'moment'

import RatingEntryItem from '@components/socialEntry/view/RatingEntryItem'


class SocialEntryItem extends Component {
  // TODO - move to a coordinator
  newReply = () => {
    const { user, item, displayInfoMessage, newReplySocialEntry } = this.props
    if ( user ) {
      newReplySocialEntry(item)
    }
    else {
      displayInfoMessage('Please register an account so you can start socializing!')
    }
  }

  renderSocialFooter = () => {
    const { displayInfoMessage, item } = this.props
    const { metadata } = item
    const repliesCount = (metadata && metadata.repliesCount) || 0

    return (
      <div className="social-entry-item-footer">
        <div className="social-entry-item-reply-container">
          <div
            className="social-entry-item-btn reply-btn"
            onClick={ this.newReply }
          />
          { repliesCount }
        </div>
        <div className="social-entry-item-btn like-btn"
          onClick={ () => displayInfoMessage('Like functionality coming soon!') }
        />
      </div>
    )
  }

  renderInputFooter = () => {
    const { clearParentSocialEntry } = this.props

    return (
      <div className="social-entry-item-footer">
        <div
          className="social-entry-item-btn clear-parent"
          onClick={ () => clearParentSocialEntry && clearParentSocialEntry() }
        />
        Remove reply to
      </div>
    )
  }

  renderSocialEntry = item => {
    const { onClick } = this.props
    const { conductedAt, metadata } = item
    const authorName = metadata && metadata.authorName
    const renderContent = item && item.renderContent

    return(
      <div
        className='social-entry-item'
        onClick={ () => onClick && onClick() }
      >
        <div>
          <h3 className='p-header'>
            { authorName }
          </h3>
            { renderContent && renderContent() }
          <p className='p-footer'>
            Posted at { Moment(conductedAt).format( 'MM-DD-YY h:mma' ) }
          </p>
        </div>
      </div>
    )
  }

  render() {
    const {
      renderSocialFooter,
      item,
      onClick,
      onMouseEnter,
      onMouseLeave,
      renderInputFooter
    } = this.props
    const { isFoodRating } = item

    return (
      <div className='social-entry-item-container'
        onMouseEnter={ onMouseEnter }
        onMouseLeave={ onMouseLeave }
      >
        { isFoodRating ?
          <RatingEntryItem
            item={ item }
            onClick={ onClick }
          />
          :
          this.renderSocialEntry(item)
        }
        { renderSocialFooter && this.renderSocialFooter() }
        { renderInputFooter && this.renderInputFooter() }
      </div>
    )
  }
}

SocialEntryItem.propTypes = {
  // supplied by container
  user: PropTypes.object,
  // supplied by parent
  renderSocialFooter: PropTypes.bool,
  renderInputFooter: PropTypes.bool,
  item: PropTypes.object,

  // supplied by container
  clearParentSocialEntry: PropTypes.func,
  displayInfoMessage: PropTypes.func,
  newReplySocialEntry: PropTypes.func,
  // supplied by parent
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

export default SocialEntryItem
