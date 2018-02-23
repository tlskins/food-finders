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
      const { users } = nextProps
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
    const { followersCount, followingCount, visible, toggleVisibility } = this.props
    const { suggestions, searchText } = this.state
    const searchTextEmpty = searchText.length === 0
    
    return (
      <div className='friends-manager'>
        <div className='friends-manager--clicker'
          onClick={ () => toggleVisibility(!visible) }
        >
          <div className='friends-manager--icon'/>
        </div>
        <div className='friends-manager--content'>
          { `followers: ${followersCount}` }<br />
          { `following: ${followingCount}` }
          <input type='text'
            className='friends-manager--content--text-input'
            value={ searchText }
            onChange={ this.updateText }
            placeholder='Find friends...'
            />
          <div className='friends-manager--content--suggestions'>
            { !searchTextEmpty && suggestions.map( (s,i) =>
              <div key={ i } className='friends-manager--content--suggestions__item'>
                <h4>
                  @{ s.name }
                </h4>
                <p>
                  { s.firstName } { s.lastName } <br />
                  following: { s.following } { this.renderEditRelationshipButton(s.following, s.id) }<br />
                  follower: { s.follower }
                </p>                  
              </div>
            ) }
          </div>
        </div>
      </div>
    )
  }

}

FriendsManager.propTypes = {
  users: PropTypes.object,
  visible: PropTypes.bool,
  followingCount: PropTypes.number,
  followersCount: PropTypes.number,

  searchUsersByText: PropTypes.func,
  toggleVisibility: PropTypes.func,
  updateUserRelationship: PropTypes.func,
}

export default FriendsManager
