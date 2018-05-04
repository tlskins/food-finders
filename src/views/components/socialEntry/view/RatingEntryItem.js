import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Moment from 'moment'


class RatingEntryItem extends Component {
  render() {
    const { onClick, item } = this.props
    const { conductedAt, metadata } = item
    const { foodRating, authorName } = metadata
    const { rateable, ratee, ratingType, ratingMetrics } = foodRating
    const rateableName = rateable && rateable.name
    const rateeName = ratee && ratee.name
    const ratingTypeName = ratingType && (ratingType.symbol + ratingType.handle)

    return (
      <div>
        <div
          className="newsfeed-item"
          onClick={ () => onClick && onClick() }
        >
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
      </div>
    )
  }
}

RatingEntryItem.propTypes = {
  user: PropTypes.object,
  item: PropTypes.object,

  onClick: PropTypes.func,
}

export default RatingEntryItem
