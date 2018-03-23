import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Rating from '@components/home/Rating'

import Moment from 'moment'


class NewsFeed extends Component {
  state = {
    feedItems: []
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
      <li className='newsfeed__item--parent'>
        <div className='newsfeed__item__content'>
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
      </li>
    )
  }

  render() {
    const { feedItems } = this.state

    const emptyFeed = feedItems.length === 0
    console.log('feedItems=',feedItems)

    return (
      <div>
        <ul className='newsfeed'>
          { emptyFeed && `Empty Feed!` }
          { feedItems.map( (f,i) => this.renderFeedItem(f) ) }
        </ul>
      </div>
    )
  }
}

NewsFeed.propTypes = {
  loadNewsfeed: PropTypes.func,
}

export default NewsFeed
