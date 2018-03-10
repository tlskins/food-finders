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
    // this.interval = setInterval(this.reloadFeedItems, 10000)
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

  render() {
    const { feedItems } = this.state
    const { toggleVisibility } = this.props

    const emptyFeed = feedItems.length === 0
    console.log('feedItems=',feedItems)

    return (
      <div>
        <ul className='newsfeed'>
          <div className='newsfeed__header-container'>
            <h1 className='newsfeed__header'>
              Feed
              <input className='compose-social-entry-btn'
                type='button'
                onClick={ () => toggleVisibility(true) }
              />
            </h1>
          </div>
          { emptyFeed && `Empty Feed!` }
          { feedItems.map( (f,i) =>
            <li key={ i } className='newsfeed__item--parent'>
              <div className='newsfeed__item__content'>
                <div>
                  <h3 className='p-header'>
                    { f.metadata.authorName }
                  </h3>
                    { f.renderContent() }
                  <p className='p-footer'>
                    Posted at { Moment(f.conductedAt).format( 'MM-DD-YY h:mma' ) }
                  </p>
                </div>
                <div>
                  { f.metadata.foodRatingTags &&
                    <Rating
                      user={ f.metadata.foodRating.rater }
                      tags={ f.metadata.foodRatingTags }
                      />
                  }
                </div>
              </div>
            </li>
          ) }
        </ul>
      </div>
    )
  }
}

NewsFeed.propTypes = {
  loadNewsfeed: PropTypes.func,
  toggleVisibility: PropTypes.func,
}

export default NewsFeed
