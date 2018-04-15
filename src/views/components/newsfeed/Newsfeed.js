import React, { Component } from 'react'
import PropTypes from 'prop-types'

import NewsFeedItem from '@containers/newsfeed/NewsfeedItem'


class NewsFeed extends Component {
  state = {
    feedItems: [],
    selectedItem: undefined,
  }

  componentDidMount() {
    this.reloadFeedItems()
    // this.interval = setInterval(this.reloadFeedItems, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  reloadFeedItems = async () => {
    const { loadNewsfeed } = this.props
    const feedItems = await loadNewsfeed()
    this.setState({ feedItems })
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

  render() {
    const { feedItems } = this.state
    const emptyFeed = feedItems.length === 0
    console.log('feedItems=',feedItems)

    return (
      <div>
        <div className='newsfeed'>
          { emptyFeed && `Empty Feed!` }
          { feedItems.map( (feedItem,i) => (
            <NewsFeedItem
              feedItem={ feedItem }
              onMouseEnter={ () => this.selectItem(feedItem) }
              onMouseLeave={ () => this.selectItem(feedItem) }
              renderFooter={ true }
            />
          ) ) }
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
