import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { searchDictionaryBy } from '~/utils'


class FriendsManager extends Component {
  state = {
    searchText: '',
    suggestions: [],
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      const { users } = this.props
      const { searchText } = this.state
      this.setState({
        suggestions: searchDictionaryBy(users, 'name', searchText)
      })
    }
  }

  updateText = e => {
    const { searchUsersByText, users } = this.props
    const { value } = e.target
    this.setState({
      searchText: value,
      suggestions: searchDictionaryBy(users, 'name', value)
    })
    searchUsersByText && searchUsersByText(value)
  }

  renderEditRelationshipButton = (isFollowing, targetId) => {
    const { updateUserRelationship } = this.props
    const type = isFollowing === 'Yes' ? 'unfollow' : 'follow'
    const buttonText = isFollowing === 'Yes' ? '-' : '+'
    return (
      <button type='button' onClick={ () => updateUserRelationship({targetId, type}) } >
        { buttonText }
      </button>
    )
  }

  render() {
    const { followersCount, followingCount } = this.props
    const { suggestions, searchText } = this.state
    const searchTextEmpty = searchText.length === 0

    return (
      <div>
        { `followers: ${followersCount}` }<br />
        { `following: ${followingCount}` }
        <textarea type="text"
          value={ searchText }
          onChange={ this.updateText }
          />
        <br />
        <div>
          { !searchTextEmpty && suggestions.map( (s,i) =>
            <div key={ i }>
              @{ s.name }: { s.first_name } { s.last_name } <br />
              following: { s.following } { this.renderEditRelationshipButton(s.following, s.id) }<br />
              follower: { s.follower }
            </div>
          ) }
        </div>
      </div>
    )
  }

}

FriendsManager.propTypes = {
  users: PropTypes.object,
  followingCount: PropTypes.number,
  followersCount: PropTypes.number,

  searchUsersByText: PropTypes.func,
  updateUserRelationship: PropTypes.func,
}

export default FriendsManager
