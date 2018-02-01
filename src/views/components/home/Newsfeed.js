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
    this.clearInterval(this.interval)
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
        <div>
          NewsFeed
          { feedItems.map( (f,i) =>
            <div key={ i }>
              { f.metadata.data }
            </div>
          ) }
        </div>
      </div>
    )
  }
}

NewsFeed.propTypes = {
  loadNewsfeed: PropTypes.func,
}

export default NewsFeed