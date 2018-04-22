import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Sticky, StickyContainer } from 'react-sticky'

import { searchDictionaryBy } from '~/utils'


class SearchHeader extends PureComponent {
  render() {
    const {
      followersCount,
      followingCount,
      renderEditRelationshipButton,
      suggestions,
      searchText,
      updateText,
      visible,
    } = this.props
    if (!visible) {
      return <div />
    }
    const searchTextEmpty = searchText.length === 0

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
        <div className='friends-manager--content--suggestions'>
          { !searchTextEmpty && suggestions.map( (s,i) =>
            <div key={ i } className='sidebar-item'>
              <div className="sidebar-item-title">
                @{ s.name }
              </div>
              <div className="sidebar-item-details">
                { s.firstName } { s.lastName } <br />
                following: { s.following } { renderEditRelationshipButton(s.following, s.id) }<br />
                follower: { s.follower }
              </div>
            </div>
          ) }
        </div>
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
      let suggestions = []
      searchDictionaryBy(users, 'name', searchText, suggestions, 15)

      this.setState({ suggestions })
    }
  }

  updateText = e => {
    const { searchUsersByText, users } = this.props
    const { value } = e.target
    let suggestions = []
    searchDictionaryBy(users, 'name', value, suggestions, 15)

    this.setState({ searchText: value, suggestions })
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

  renderStickySearchHeader = ({ isSticky, style }) => {
    const { followersCount, followingCount, visible } = this.props
    const { searchText, suggestions } = this.state
    if ( isSticky ) {
      style = { ...style, top: '160px' }
    }
    return (
      <SearchHeader
        style={style}
        followersCount={ followersCount }
        followingCount={ followingCount }
        updateText={ this.updateText }
        renderEditRelationshipButton={ this.renderEditRelationshipButton }
        searchText={ searchText }
        suggestions={ suggestions }
        visible={ visible }
      />
    )
  }

  render() {
    const { visible } = this.props
    let className = "friends-manager sidebar"
    if (!visible) {
      className += " hide-sidebar"
    }

    return (
      <div className={ className }>
        <StickyContainer style={{ height: '100%', width: '100%' }}>
          <div className='sidebar-content'>
            <div className="friends-manager-container">
              <div className='friends-manager--content'>
                <Sticky topOffset={-145}>
                  { this.renderStickySearchHeader }
                </Sticky>
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
