import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Rating from '@components/home/Rating'

import Moment from 'moment'


class NewsFeed extends Component {
  state = {
    feedItems: [],
    hoveredItem: undefined,
  }

  componentDidMount() {
    this.reloadFeedItems()
    this.interval = setInterval(this.reloadFeedItems, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  reloadFeedItems = async () => {
    console.log('reloadingFeedItems')
    const { loadNewsfeed } = this.props
    const feedItems = await loadNewsfeed()
    this.setState({ feedItems })
  }

  renderFeedItem = item => {
    const { conductedAt, metadata } = item

    return (
      <div className='newsfeed-item-container'>
        <div className='newsfeed-item'>
          <div>
            <h3 className='p-header'>
              { metadata.authorName }
            </h3>
              { item.renderContent() }
            <p className='p-footer'>
              Posted at { Moment(conductedAt).format( 'MM-DD-YY h:mma' ) }
            </p>
          </div>
          <div>
            { item.metadata.foodRatingTags &&
              <Rating
                user={ metadata.foodRating.rater }
                tags={ metadata.foodRatingTags }
                />
            }
          </div>
        </div>
      </div>
    )
  }

  renderRatingFeedItem = item => {
    const { conductedAt, metadata } = item
    const { foodRating, authorName } = metadata
    const { rateable, ratee, ratingType, ratingMetrics } = foodRating
    const rateableName = rateable && rateable.name
    const rateeName = ratee && ratee.name
    const ratingTypeName = ratingType && (ratingType.symbol + ratingType.handle)

    return (
      <div className="newsfeed-item-container">
        <div className="newsfeed-item">
          <div className="newsfeed-item-header">
            { rateableName }
          </div>
          <div className="newsfeed-item-sub-header">
            <span className="newsfeed-item-sub-header-item">{ rateeName }</span>
          </div>
          <div className="rating">
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

  render() {
    const { feedItems } = this.state
    const emptyFeed = feedItems.length === 0
    console.log('feedItems=',feedItems)

    return (
      <div>
        <div className='newsfeed'>
          { emptyFeed && `Empty Feed!` }
          { feedItems.map( (f,i) => {
            if ( f.metadata && f.metadata.foodRating ) {
              return this.renderRatingFeedItem(f)
            }
            else {
              return this.renderFeedItem(f)
            }
          } ) }
        </div>
      </div>
    )
  }
}

NewsFeed.propTypes = {
  loadNewsfeed: PropTypes.func,
}

export default NewsFeed
