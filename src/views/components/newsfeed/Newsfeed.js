import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SocialEntryItem from '@containers/socialEntry/view/SocialEntryItem'


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

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      const { newsfeed: feedItems } = nextProps
      this.setState({ feedItems })
    }
  }

  reloadFeedItems = async () => {
    const { loadNewsfeed } = this.props
    loadNewsfeed()
    console.log('feedItems=',this.state.feedItems)
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
    const { clickNewsfeedItem } = this.props
    const emptyFeed = feedItems.length === 0

    return (
      <div>
        <div className='newsfeed'>
          { emptyFeed && `Empty Feed!` }
          { feedItems.map( (feedItem,i) => (
            <div className="newsfeed-item" key={i}>
              <SocialEntryItem
                item={ feedItem }
                renderSocialFooter={ true }
                onMouseEnter={ () => this.selectItem(feedItem) }
                onMouseLeave={ () => this.unselectItem() }
                onClick={ () => clickNewsfeedItem(feedItem) }
              />
            </div>
          ) ) }
        </div>
      </div>
    )
  }
}

NewsFeed.propTypes = {
  newsfeed: PropTypes.arrayOf(PropTypes.object),

  loadNewsfeed: PropTypes.func,
  clickNewsfeedItem: PropTypes.func,
  selectNewsfeedItem: PropTypes.func,
}

export default NewsFeed
