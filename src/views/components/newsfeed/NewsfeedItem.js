import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Moment from 'moment'


class NewsFeedItem extends Component {
  renderFeedItem = item => {
    const { renderFooter } = this.props
    const { conductedAt, metadata } = item
    const authorName = metadata && metadata.authorName
    const renderContent = item && item.renderContent

    return (
      <div className='newsfeed-item-container'>
        <div className='newsfeed-item'>
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
        { renderFooter && this.renderFooter() }
      </div>
    )
  }

  renderRatingFeedItem = item => {
    const { onMouseEnter, onMouseLeave, renderFooter, renderInputFooter } = this.props
    const { conductedAt, metadata } = item
    const { foodRating, authorName } = metadata
    const { rateable, ratee, ratingType, ratingMetrics } = foodRating
    const rateableName = rateable && rateable.name
    const rateeName = ratee && ratee.name
    const ratingTypeName = ratingType && (ratingType.symbol + ratingType.handle)

    return (
      <div className="newsfeed-item-container"
        onMouseEnter={ onMouseEnter }
        onMouseLeave={ onMouseLeave }
      >
        <div className="newsfeed-item">
          <div className="item-header newsfeed-item-header">
            { rateableName }
          </div>
          <div className="item-sub-header">
            <span className="item-sub-header-component">{ rateeName }</span>
          </div>
          <div className="rating">
            <div className="rating-inner-container">
              <span className="rating-component">{ ratingTypeName }</span>
              <span className="rating-component"> • </span>
              { ratingMetrics && ratingMetrics.map( (m,i) => {
                const renderBullet = i !== ratingMetrics.length - 1
                return (
                  <div>
                    <span className="rating-component">{ m.symbol + m.handle }</span>
                    { renderBullet && <span className="rating-component"> • </span> }
                  </div>
                ) } )
              }
            </div>
          </div>
          <div>
            { item.renderContent() }
            <p className='p-footer'>
              { authorName }<br />
              Posted at { Moment(conductedAt).format( 'MM-DD-YY h:mma' ) }
            </p>
          </div>
        </div>
        { renderFooter && this.renderFooter() }
        { renderInputFooter && this.renderInputFooter() }
      </div>
    )
  }

  newReply = () => {
    const { user, feedItem, displayInfoMessage, newReplySocialEntry } = this.props
    if ( user ) {
      newReplySocialEntry(feedItem)
    }
    else {
      displayInfoMessage('Please register an account so you can start socializing!')
    }
  }

  renderFooter = () => {
    const { feedItem } = this.props
    const { metadata } = feedItem
    const repliesCount = (metadata && metadata.repliesCount) || 0

    return (
      <div className="newsfeed-item-footer">
        <div className="newsfeed-item-reply-container">
          <div
            className="newsfeed-item-btn reply-btn"
            onClick={ this.newReply }
          />
          { repliesCount }
        </div>
        <div className="newsfeed-item-btn like-btn" />
      </div>
    )
  }

  renderInputFooter = () => {
    const { clearParentSocialEntry } = this.props

    return (
      <div className="newsfeed-item-footer">
        <div
          className="newsfeed-item-btn clear-parent"
          onClick={ () => clearParentSocialEntry() }
        />
      </div>
    )
  }

  render() {
    const { feedItem } = this.props
    const { metadata } = feedItem
    const foodRating = metadata && metadata.foodRating

    return (
      <div>
        { foodRating ?
          this.renderRatingFeedItem(feedItem)
          :
          this.renderFeedItem(feedItem)
        }
      </div>
    )
  }
}

NewsFeedItem.propTypes = {
  user: PropTypes.object,
  renderFooter: PropTypes.bool,
  displayInputFooter: PropTypes.bool,
  feedItem: PropTypes.object,

  clearParentSocialEntry: PropTypes.func,
  displayInfoMessage: PropTypes.func,
  newReplySocialEntry: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

export default NewsFeedItem
