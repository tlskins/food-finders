import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Moment from 'moment'


class NewsFeed extends Component {
  state = {
    feedItems: [],
    selectedItem: undefined,
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
        </div>
      </div>
    )
  }

  selectItem = item => {
    const { selectNewsfeedItem } = this.props
    this.setState({ selectedItem: item })
    selectNewsfeedItem(item)
  }

  unselectItem = () => {
    const { selectNewsfeedItem } = this.props
    this.setState({ selectedItem: undefined })
    selectNewsfeedItem(undefined)
  }

  renderRatingFeedItem = item => {
    const { conductedAt, metadata } = item
    const { foodRating, authorName } = metadata
    const { rateable, ratee, ratingType, ratingMetrics } = foodRating
    const rateableName = rateable && rateable.name
    const rateeName = ratee && ratee.name
    const ratingTypeName = ratingType && (ratingType.symbol + ratingType.handle)

    return (
      <div className="newsfeed-item-container"
        onMouseEnter={ () => this.selectItem(item) }
        onMouseLeave={ () => this.unselectItem(item) }
      >
        <div className="newsfeed-item">
          <div className="item-header newsfeed-item-header">
            { rateableName }
          </div>
          <div className="item-sub-header">
            <span className="item-sub-header-component">{ rateeName }</span>
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
  selectNewsfeedItem: PropTypes.func,
}

export default NewsFeed
