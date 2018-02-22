import React, { Component } from 'react'
import PropTypes from 'prop-types'

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

  render() {
    const { feedItems } = this.state

    return (
      <div>
        <ul className='newsfeed'>
          <h1 className='newsfeed__header'>NewsFeed</h1>
          { feedItems.map( (f,i) =>
            <li key={ i } className='newsfeed__item--parent'>
              <div className='newsfeed__item__content'>
                { f.metadata.authorName }: { f.metadata.data }
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
}

export default NewsFeed
