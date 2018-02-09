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
    const { SearchUsersByText, users } = this.props
    const { value } = e.target
    this.setState({
      searchText: value,
      suggestions: searchDictionaryBy(users, 'name', value)
    })
    SearchUsersByText && SearchUsersByText(value)
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
              @{ s.name }: { s.first_name } { s.last_name }
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

  SearchUsersByText: PropTypes.func,
}

export default FriendsManager
