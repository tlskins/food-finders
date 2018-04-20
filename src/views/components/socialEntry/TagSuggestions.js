import React, { Component } from 'react'
import PropTypes from 'prop-types'


class TagSuggestions extends Component {
  state = {
    selectedTagIndex: undefined,
    selectedTag: undefined,
    selectedTagChanged: false,
    parentTaggableType: '',
    tagSuggestions: [],
    childTagSuggestions: [],
  }

  componentWillReceiveProps = nextProps => {
    const { selectedTagIndex, tagSuggestions, childTagSuggestions } = nextProps
    const selectedTag = tagSuggestions[selectedTagIndex]
    const parentTaggableType = selectedTag && selectedTag.taggableType && selectedTag.taggableType.toLowerCase()
    const selectedTagChanged = (selectedTag && selectedTag.id) !== (this.state.selectedTag && this.state.selectedTag.id)

    this.setState({
      selectedTagIndex,
      selectedTag,
      selectedTagChanged,
      parentTaggableType,
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

  render() {
    const { onClickTag, onMouseOverTag, searchStatus } = this.props
    const {
      selectedTagIndex,
      parentTaggableType,
      tagSuggestions,
      childTagSuggestions,
    } = this.state

    if ( this.state.selectedTagChanged ) {
      this.setState({ selectedTagChanged: false })
    }

    const childTagsPresent = childTagSuggestions.length > 0
    const taggableTypeString = (parentTaggableType && parentTaggableType.toLowerCase()) || ""
    const parentChildTagGap = childTagsPresent ? selectedTagIndex - (childTagSuggestions.length - 1) : 0

    return (
      <div>
        { searchStatus && searchStatus }
        <div className='tag-suggestions-container'>
          <div className='tag-suggestions'>
            { tagSuggestions.map( (t,i) =>
              <div className={ "tag-suggestion-container" + (selectedTagIndex === i ? " active-suggestion" : "") }>
                <div
                  key={i}
                  className={ 'tag-suggestion--' + (t.taggableType || '').toLowerCase() + (selectedTagIndex === i ? ' selected ' : '') }
                  onClick={ () => onClickTag(t) }
                  onMouseEnter={ () => onMouseOverTag(i) }
                >
                  <div className={ 'tag-suggestions-icon--' + (t.taggableType || '').toLowerCase() }/>
                  <div className="tag-suggestion-hdr">
                    { t.name }
                  </div>
                  { /** TODO - put these div renders in a presenter **/
                  }
                  { ['FoodRatingMetric','FoodRatingType','User'].includes(t.taggableType) && t.embeddedTaggable &&
                    <div className="tag-suggestion-description">
                      { `${ t.symbol }${ t.handle }` }<br />
                      { t.embeddedTaggable.description }
                    </div>
                  }
                  { t.taggableType === 'Entity' && t.embeddedTaggable &&
                    <div className="tag-suggestion-description">
                      { `${ t.symbol }${ t.embeddedTaggable.handle }` }<br />
                      { t.embeddedTaggable.location.displayAddress.join(', ') }<br />
                    </div>
                  }
                  { t.taggableType === 'Entity' && t.yelpBusiness &&
                    <div className="tag-suggestion-description">
                      { `${ t.symbol }${ t.yelpBusiness.alias }` }<br />
                      { t.yelpBusiness.location.displayAddress.join(', ') }<br />
                    </div>
                  }
                </div>
              </div>
            ) }
          </div>
          { childTagsPresent &&
            <div className='tag-suggestions-children'>
              { this.renderParentChildTagBuffer(parentChildTagGap) }
              { childTagSuggestions.map( (t,i) =>
                <div className="tag-suggestion-container active-suggestion">
                  <div
                    key={i}
                    className={ "tag-suggestion--" + taggableTypeString }
                  >
                    <div className="tag-suggestion-hdr">
                      { t.name }
                    </div>
                    <div className="tag-suggestion-description">
                      { t.description }
                    </div>
                  </div>
                </div>
              ) }
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
