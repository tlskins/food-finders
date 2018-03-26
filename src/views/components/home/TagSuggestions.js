import React, { Component } from 'react'
import PropTypes from 'prop-types'


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
      selectedTagIndex,
      parentTaggableType,
      tagSuggestions
    } = this.state

    if ( this.state.selectedTagChanged ) {
      this.setState({ selectedTagChanged: false })
    }

    return (
      <div className='social-entry-form__suggestions-container'>
        <div className='social-entry-form__suggestions'>
          { tagSuggestions.map( (t,i) =>
            <div className={ "suggestions__item-container" + (selectedTagIndex === i ? " active-suggestion" : "") }>
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
                { ['FoodRatingMetric','FoodRatingType'].includes(t.taggableType) && t.embeddedTaggable &&
                  <div className={ 'form__suggestions__item--main-description' }>
                    { t.embeddedTaggable.description }<br />
                    { t.embeddedTaggable.synonyms.length > 0 && `Synonyms: ${ t.embeddedTaggable.synonyms.join(', ') }` }
                  </div>
                }
                { t.taggableType === 'Entity' && t.embeddedTaggable &&
                  <div className={ 'form__suggestions__item--main-description' }>
                    { t.embeddedTaggable.id }<br />
                    { t.embeddedTaggable.location.displayAddress.join(', ') }<br />
                    { t.embeddedTaggable.categories.map( c => c.title ).join(', ') }<br />
                    { t.embeddedTaggable.rating }
                  </div>
                }
                { t.taggableType === 'Entity' && t.yelpBusiness &&
                  <div className={ 'form__suggestions__item--main-description' }>
                    { t.yelpBusiness.id }<br />
                    { t.yelpBusiness.location.displayAddress.join(', ') }<br />
                    { t.yelpBusiness.categories.map( c => c.title ).join(', ') }<br />
                    { t.yelpBusiness.rating }
                  </div>
                }
              </div>
            </div>
          ) }
        </div>
        <div className='social-entry-form__suggestions-children'>
          { childTags.map( (t,i) =>
            <div className="suggestions__item-container active-suggestion">
              <div
                key={i}
                className={ 'social-entry-form__suggestions__shortitem--' + parentTaggableType + ` child-tag ${ t.id }`}
              >
                <div>
                  { t.name }
                </div>
                <div className={ 'form__suggestions__item--description' }>
                  { t.description }
                </div>
              </div>
            </div>
          ) }
        </div>
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
