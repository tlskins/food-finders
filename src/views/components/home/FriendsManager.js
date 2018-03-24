import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Sticky, StickyContainer } from 'react-sticky'

import { searchDictionaryBy } from '~/utils'


class SearchHeader extends PureComponent {
  render() {
    const {
      followersCount,
      followingCount,
      searchText,
      updateText,
      visible,
    } = this.props
    if (!visible) {
      return <div />
    }
    return (
      <div className="friends-manager--content--search" style={{ ...this.props.style }}>
        <div>
          { `followers: ${ followersCount }` }<br />
          { `following: ${ followingCount }` }
        </div>
        <input type='text'
          className='friends-manager--content--text-input'
          value={ searchText }
          onChange={ updateText }
          placeholder='Find friends...'
          />
     </div> )
  }
}


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
    const { followersCount, followingCount, visible } = this.props
    const { suggestions, searchText } = this.state
    const searchTextEmpty = searchText.length === 0
    let className = "friends-manager sidebar"
    if (!visible) {
      className += " hide-sidebar"
    }

    return (
      <div className={ className }>
        <StickyContainer style={{ height: '100%' }}>
          <div className='sidebar-content'>
            <div className="friends-manager-container">
              <div className='friends-manager--content'>
                <Sticky topOffset={-145}>
                  {({ isSticky, style }) => {
                    if ( isSticky ) {
                      style = { ...style, top: '160px' }
                    }
                    return (
                      <SearchHeader
                        style={style}
                        followersCount={ followersCount }
                        followingCount={ followingCount }
                        updateText={ this.updateText }
                        searchText={ searchText }
                        visible={ visible }
                      />
                    )
                  }}
                </Sticky>
                <div className='friends-manager--content--suggestions'>
                  { !searchTextEmpty && suggestions.map( (s,i) =>
                    <div key={ i } className='sidebar-item'>
                      <div className="sidebar-item-title">
                        @{ s.name }
                      </div>
                      <div className="sidebar-item-details">
                        { s.firstName } { s.lastName } <br />
                        following: { s.following } { this.renderEditRelationshipButton(s.following, s.id) }<br />
                        follower: { s.follower }
                      </div>
                    </div>
                  ) }
                </div>
              </div>
            </div>
          </div>
        </StickyContainer>
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
