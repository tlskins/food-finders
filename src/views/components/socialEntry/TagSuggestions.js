import React, { Component } from 'react'
import PropTypes from 'prop-types'


class TagSuggestions extends Component {
  state = {
    selectedTagIndex: undefined,
    selectedTag: undefined,
    selectedTagChanged: false,
    tagSuggestions: [],
    childTagSuggestions: [],
  }

  componentWillReceiveProps = nextProps => {
    const { selectedTagIndex, tagSuggestions, childTagSuggestions } = nextProps
    const selectedTag = tagSuggestions[selectedTagIndex]
    const selectedTagChanged = (selectedTag && selectedTag.id) !== (this.state.selectedTag && this.state.selectedTag.id)

    this.setState({
      selectedTagIndex,
      selectedTag,
      selectedTagChanged,
      tagSuggestions,
      childTagSuggestions,
    })
  }

  renderParentChildTagBuffer = parentChildTagGap => {
    if ( !parentChildTagGap ) {
      return null
    }
    const buffers = []
    for ( let i = 0; i < parentChildTagGap; i++ ) {
      buffers.push(<div className="tag-suggestion-buffer"/>)
    }
    return (
      <div>
        { buffers.map( b => b ) }
      </div>
    )
  }

  renderTagSuggestion = ({ tagSuggestion, selected, index }) => {
    const { onClickTag, onMouseOverTag } = this.props
    const { taggableType, embeddedTaggable, name, symbol, handle } = tagSuggestion
    const taggableTypeString = (taggableType || '').toLowerCase()

    return (
      <div className={ "tag-suggestion-container" + (selected ? " active-suggestion" : "") }>
        <div
          className={ 'tag-suggestion--' + taggableTypeString + (selected ? ' selected ' : '') }
          onClick={ () => onClickTag(tagSuggestion) }
          onMouseEnter={ () => onMouseOverTag(index) }
        >
          <div className={ 'tag-suggestions-icon--' + taggableTypeString }/>
          <div className="tag-suggestion-hdr">
            { name }
          </div>
          { ['FoodRatingMetric','FoodRatingType','User','Entity'].includes(taggableType) && embeddedTaggable &&
            <div className="tag-suggestion-description">
              { `${ symbol }${ handle }` }<br />
              { embeddedTaggable.description }
            </div>
          }
        </div>
      </div>
    )
  }

  render() {
    const { searchStatus } = this.props
    const {
      selectedTagIndex,
      tagSuggestions,
      childTagSuggestions,
    } = this.state

    if ( this.state.selectedTagChanged ) {
      this.setState({ selectedTagChanged: false })
    }

    const childTagsPresent = childTagSuggestions.length > 0
    const parentChildTagGap = childTagsPresent ? selectedTagIndex - (childTagSuggestions.length - 1) : 0

    return (
      <div>
        { searchStatus && searchStatus }
        <div className='tag-suggestions-container'>
          <div className='tag-suggestions'>
            { tagSuggestions.map( (tagSuggestion,index) => {
              const selected = index === selectedTagIndex
              return this.renderTagSuggestion({ tagSuggestion, selected, index })
            })}
          </div>
          { childTagsPresent &&
            <div className='tag-suggestions-children'>
              { this.renderParentChildTagBuffer(parentChildTagGap) }
              { childTagSuggestions.map( (tagSuggestion,index) => {
                return this.renderTagSuggestion({ tagSuggestion, selected: true, index })
              })}
            </div>
          }
        </div>
      </div>
    )
  }
}

TagSuggestions.propTypes = {
  searchStatus: PropTypes.string,
  tagSuggestions: PropTypes.arrayOf(PropTypes.object),
  childTagSuggestions: PropTypes.arrayOf(PropTypes.object),
  selectedTagIndex: PropTypes.number,

  onClickTag: PropTypes.func,
  onMouseOverTag: PropTypes.func,
}

export default TagSuggestions
