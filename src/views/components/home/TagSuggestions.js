import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { SteppedLineTo } from 'react-lineto'


class TagSuggestions extends Component {
  state = {
    selectedTagIndex: undefined,
    selectedTag: undefined,
    selectedTagChanged: false,
    parentTaggableType: '',
    tagSuggestions: [],
    childTags: [],
  }

  componentWillReceiveProps = nextProps => {
    const { selectedTagIndex, tagSuggestions } = nextProps
    const selectedTag = tagSuggestions[selectedTagIndex]
    const childTags = (selectedTag && selectedTag.embeddedTaggable && selectedTag.embeddedTaggable.children) || []
    const parentTaggableType = selectedTag && selectedTag.taggableType && selectedTag.taggableType.toLowerCase()
    const selectedTagChanged = (selectedTag && selectedTag.id) !== (this.state.selectedTag && this.state.selectedTag.id)

    this.setState({
      selectedTagIndex,
      selectedTag,
      selectedTagChanged,
      parentTaggableType,
      tagSuggestions,
      childTags,
    })
  }

  render() {
    const { onClickTag, onMouseOverTag } = this.props
    const {
      childTags,
      selectedTag,
      selectedTagIndex,
      parentTaggableType,
      tagSuggestions
    } = this.state

    const parentChildrenLines = childTags.map( t =>
      <SteppedLineTo
        className='parent-child-tag-line'
        from={ `${ selectedTag.id }` }
        fromAnchor="right"
        to={ `${ t.id }` }
        toAnchor="left"
        orientation="h"
      />
    )

    if ( this.state.selectedTagChanged ) {
      this.setState({ selectedTagChanged: false })
    }

    return (
      <div className='social-entry-form__suggestions-container'>
        <div className='social-entry-form__suggestions'>
          { tagSuggestions.map( (t,i) =>
            <div
              key={i}
              className={ 'social-entry-form__suggestions__item--' + (t.taggableType || '').toLowerCase() + ` ${ t.id } ` + (selectedTagIndex === i ? ' selected ' : '') }
              onClick={ () => onClickTag(t, new Date()) }
              onMouseEnter={ () => onMouseOverTag(i) }
            >
              <div className={ 'social-entry-form__suggestions__icon--' + (t.taggableType || '').toLowerCase() }/>
              <div>
                { t.name }
              </div>
              <p className={ 'form__suggestions__item--description' }>
                { t.embeddedTaggable && t.embeddedTaggable.description && `${ t.embeddedTaggable.description }` }
              </p>
              <p className={ 'form__suggestions__item--description' }>
                { t.embeddedTaggable && t.embeddedTaggable.synonyms.length > 0 && `Synonyms: ${ t.embeddedTaggable.synonyms }` }
              </p>
            </div>
          ) }
        </div>
        <div className='social-entry-form__suggestions-children'>
          { childTags.map( (t,i) =>
            <div
              key={i}
              className={ 'social-entry-form__suggestions__shortitem--' + parentTaggableType + ` child-tag ${ t.id }`}
            >
              <div>
                { t.name }
              </div>
              <p className={ 'form__suggestions__item--description' }>
                { t.description }
              </p>
            </div>
          ) }
        </div>
        { parentChildrenLines }
      </div>
    )
  }
}

TagSuggestions.propTypes = {
  tagSuggestions: PropTypes.arrayOf(PropTypes.object),
  selectedTagIndex: PropTypes.number,

  onClickTag: PropTypes.func,
  onMouseOverTag: PropTypes.func,
}

export default TagSuggestions
