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
    const { toggleVisibility } = this.props

    return (
      <div>
        <ul className='newsfeed'>
          <div className='newsfeed__header-container'>
            <h1 className='newsfeed__header'>
              NewsFeed 
              <input className='compose-social-entry-btn'
                type='button' 
                onClick={ () => toggleVisibility(true) } 
              />
            </h1>
          </div>
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
  toggleVisibility: PropTypes.func,
}

export default NewsFeed
