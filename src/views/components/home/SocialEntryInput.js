import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TagSuggestions from '@components/home/TagSuggestions'
import close from '@res/images/x-icon-gray.png'

import {
  findWordAtCursor,
  getAllNestedValues,
  searchDictionaryBy,
  searchDictionaryByArray,
  searchDictionaryByKeys,
} from '~/utils'


const initialDraftSocialEntry = { text: '', tags: []}

class SocialEntryInput extends Component {
  constructor(props) {
    console.log('SocialEntryInput constructor called')
    super(props)
    const { draftSocialEntry } = props

    this.state = {
      lastEditAt: undefined,
      text: (draftSocialEntry && draftSocialEntry.text) || '',
      searchText: '',
      searchHandles: undefined,
      searchStatus: undefined,
      draftSocialEntry: draftSocialEntry || initialDraftSocialEntry,
      tagSuggestions: [],
      tagSymbol: undefined,
      selectedTagIndex: undefined,
      creatableTags: (draftSocialEntry && draftSocialEntry.creatableTags) || [],
      cursorBeginIndex: 0,
      cursorEndIndex: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
      const { searchText, tagSymbol, lastEditAt } = this.state
      const { draftSocialEntry, requestedAt, tags, tagSearches } = nextProps

      if ( lastEditAt >= requestedAt ) {
        this.setState({ draftSocialEntry })
      }

      if ( tagSymbol ) {
        this.populateTagSuggestions(tags)

        if ( tagSearches[tagSymbol][searchText] ) {
          const searchStatuses = getAllNestedValues(tagSearches[tagSymbol][searchText])
          if ( searchStatuses.some( s => ['START_TAG_SEARCH', 'INCOMPLETE_TAG_SEARCH'].includes(s) ) ) {
            this.setState({ searchStatus: `Loading suggestions for '${ searchText }'...` })
          }
          else {
            this.setState({ searchStatus: `Loaded all suggestions for '${ searchText }'...` })
          }
        }
      }
  }

  populateTagSuggestions = (tags, tagsCount = 5) => {
    const { searchText, searchHandles, tagSymbol } = this.state
    const tagsBySymbol = { ...tags[tagSymbol] }
    delete tagsBySymbol.roots
    const roots = tags[tagSymbol].roots || []

    if ( Object.values(tagsBySymbol).length < 1 ) {
      return
    }

    if ( typeof searchText !== 'undefined' ) {
      if ( searchText.length > 0 ) {
        let tagSuggestions = searchDictionaryBy(tagsBySymbol, 'name', searchText)
        if ( tagSuggestions.length < tagsCount ) {
          const remainingCount = tagsCount - tagSuggestions.length
          tagSuggestions = [ ...tagSuggestions, ...searchDictionaryBy(tagsBySymbol, 'embeddedTaggable.description', searchText, remainingCount) ]
        }
        if ( tagSuggestions.length < tagsCount ) {
          const remainingCount = tagsCount - tagSuggestions.length
          tagSuggestions = [ ...tagSuggestions, ...searchDictionaryByArray(tagsBySymbol, 'embeddedTaggable.synonyms', searchText, remainingCount) ]
        }
        this.setState({ tagSuggestions, selectedTagIndex: 0 })
      }
      else {
        this.setState({ tagSuggestions: roots, selectedTagIndex: 0 })
      }
    }
    else if ( searchHandles ) {
      const searchKeys = searchHandles.map( h => h.slice(1) )
      if ( searchKeys.length > 0 ) {
        const tagSuggestions = searchDictionaryByKeys(tagsBySymbol, searchKeys)
        this.setState({ tagSuggestions })
      }
      else {
        this.setState({ tagSuggestions: roots, selectedTagIndex: 0 })
      }
    }
  }

  onKeyDown = e => {
    let { selectedTagIndex } = this.state
    const { tagSuggestions } = this.state
    if ( tagSuggestions.length > 0 ) {
      // right arrow key
      if ( e.keyCode === 39 ) {
        e.stopPropagation()
        e.preventDefault()
        const selectedTag = tagSuggestions[selectedTagIndex]
        const selectedTaggable = selectedTag.embeddedTaggable
        if ( selectedTaggable && selectedTaggable.children && selectedTaggable.children.length > 0 ) {
          const childTagHandles = selectedTaggable.children.filter( c => {
            return c.tagSymbol && c.tagHandle
          }).map( c => c.tagSymbol + c.tagHandle )
          this.setState({
            searchHandles: childTagHandles,
            searchText: undefined,
            selectedTagIndex: 0,
            searchStatus: `Loading ${ selectedTag.name }...`,
          }, () => this.calculateTags() )
        }
      }
      // left arrow key
      else if ( e.keyCode === 37 ) {
        e.stopPropagation()
        e.preventDefault()
        const selectedTag = tagSuggestions[selectedTagIndex]
        if ( selectedTag.embeddedTaggable && selectedTag.embeddedTaggable.parent ) {
          const parentTaggable = selectedTag.embeddedTaggable.parent
          const parentHandle = parentTaggable.tagSymbol + parentTaggable.tagHandle
          const parentSiblingHandles = (parentTaggable && parentTaggable.siblings) || []
          this.setState({
            searchHandles: [parentHandle, ...parentSiblingHandles],
            searchText: undefined,
            selectedTagIndex: 0,
            searchStatus: `Loading ${ selectedTag.name }...`,
          }, () => this.calculateTags() )
        }
        else {
          this.setState({
            searchHandles: [],
            searchText: undefined,
            selectedTagIndex: 0,
          }, () => this.calculateTags() )
        }
      }
      // down arrow key
      else if ( e.keyCode === 40 ) {
        e.stopPropagation()
        e.preventDefault()
        selectedTagIndex += 1
        if ( selectedTagIndex >= tagSuggestions.length ) {
          selectedTagIndex = 0
        }
        this.setState({ selectedTagIndex })
      }
      // up arrow key
      else if ( e.keyCode === 38 ) {
        e.stopPropagation()
        e.preventDefault()
        selectedTagIndex -= 1
        if ( selectedTagIndex < 0 ) {
          selectedTagIndex = tagSuggestions.length - 1
        }
        this.setState({ selectedTagIndex })
      }
      // enter arrow key
      else if ( e.keyCode === 13 ) {
        e.stopPropagation()
        e.preventDefault()
        this.addTag( tagSuggestions[selectedTagIndex], new Date() )()
      }
    }
  }

  updateText = e => {
    const { creatableTags } = this.state
    const newText = e.target.value
    const selectionStart = e.target.selectionStart
    const currentEditAt = new Date()

    const cursorTextData = this.calculateCursorTextData(newText, selectionStart)
    this.setState({ text: newText, lastEditAt: currentEditAt, ...cursorTextData }, () => this.calculateTags(newText) )
    this.updateSocialEntry(newText, creatableTags, currentEditAt)
  }

  calculateCursorTextData = (text, selectionStart) => {
    const { currentWord, cursorBeginIndex, cursorEndIndex } = findWordAtCursor(text, selectionStart)
    const { tags } = this.props
    if ( currentWord && tags[currentWord[0]]) {
      const tagSymbol = currentWord[0]
      const searchText = currentWord.substr(1)

      return { cursorBeginIndex, cursorEndIndex, tagSymbol, searchText }
    }
    else {
      return { cursorBeginIndex, cursorEndIndex, tagSymbol: undefined, searchText: '' }
    }
  }

  updateSocialEntry = async (text, creatableTags, requestedAt) => {
    const { updateDraftSocialEntry } = this.props
    await updateDraftSocialEntry( text, creatableTags, requestedAt )
  }

  addTag = (tag, currentEditAt, editData = null) => () => {
    const { symbol, handle } = tag
    let { text, cursorBeginIndex, cursorEndIndex } = this.state
    if ( editData ) {
      cursorBeginIndex = editData.cursorBeginIndex
      cursorEndIndex = editData.cursorEndIndex
    }
    const newText = text.slice(0, cursorBeginIndex) + symbol + handle + text.slice(cursorEndIndex)
    const creatableTags = this.addCreatableEntityTag(tag)

    this.setState({ text: newText, creatableTags })
    this.clearTagSearch()
    this.updateSocialEntry(newText, creatableTags, currentEditAt)
  }

  addCreatableEntityTag = tag => {
    let { creatableTags } = this.state
    if ( !tag.id && tag.yelpBusiness ) {
      const { taggableType, symbol, handle } = tag
      creatableTags = [...creatableTags, { taggableType, symbol, handle }]
    }
    return creatableTags
  }

  calculateTags = async (text = null) => {
    const { suggestTags, tags } = this.props
    const { searchHandles, searchText, tagSymbol } = this.state

    if ( tagSymbol ) {
      if ( typeof searchText !== 'undefined' ) {
        this.populateTagSuggestions(tags)
        if ( searchText.length > 0 ) {
          await suggestTags({ symbol: tagSymbol, text: searchText, resultsPerPage: 5, page: 1 })
        }
      }
      else if ( searchHandles ) {
        this.populateTagSuggestions(tags)
        await suggestTags({ symbol: tagSymbol, handles: searchHandles, resultsPerPage: 5, page: 1 })
      }
    }
    else {
      this.clearTagSearch()
    }
  }

  onPost = async () => {
    const { postSocialEntry } = this.props
    const { text, creatableTags } = this.state

    this.clearTagSearch()

    await postSocialEntry(text, creatableTags)

    this.props.toggleVisibility(false)
  }

  clearTagSearch = () => {
    this.setState({ tagSuggestions: [], searchStatus: undefined, tagSymbol: undefined, selectedTagIndex: undefined })
  }

  close = e => {
    e.preventDefault()

    this.props.toggleVisibility(false)
  }

  renderCurrentTags = (tags, creatableTags) => {
    const noTags = !tags || tags.length === 0
    const noCreatableTags = !creatableTags || creatableTags.length === 0
    if ( noTags && noCreatableTags ) {
      return null
    }

    return (
      <div className="tags-container item-sub-header">
        { !noTags &&
          <div className="tags-list">
            <div className="bold-attribute tags-list-header">
              Current Tags
            </div>
            <div className="tags-inner-container">
              <div className="tags-inner-container-element">
                { tags.map( (t,i) =>
                  <div className={ 'social-entry-tag__' + (t.taggableType || '').toLowerCase() }
                    key={ i }
                  >
                    { t.symbol + t.handle }
                  </div> )
                }
              </div>
            </div>
          </div>
        }
        { !noCreatableTags &&
          <div className="tags-list">
            <div className="bold-attribute tags-list-header">
              Created Tags
            </div>
            <div className="tags-inner-container">
              <div className="tags-inner-container-element">
                { creatableTags.map( (t,i) =>
                  <div className={ 'social-entry-tag__' + (t.taggableType || '').toLowerCase() }
                    key={ i }
                  >
                    { t.symbol + t.handle }
                  </div> )
                }
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  renderRating = tags => {
    const foodRatingTypeTags = tags && tags.filter( t => t.taggableType === 'FoodRatingType' )
    if ( !foodRatingTypeTags || foodRatingTypeTags.length === 0 ) {
      return null
    }
    const foodRatingTypeMetrics = tags.filter( t => t.taggableType === 'FoodRatingMetric' )
    const foods = tags.filter( t => t.taggableType === 'Food' )
    const entities = tags.filter( t => t.taggableType === 'Entity' )
    const { symbol, handle } = foodRatingTypeTags[0]
    const ratingTypeName = symbol + handle
    const foodName = foods && foods[0] && foods[0].name
    const entityName = entities && entities[0] && entities[0].name

    return (
      <div className="rating">
        { foodName &&
          <div className="rating-sub-header">
            <span class="item-sub-header-component"> { foodName } </span>
          </div>
        }
        { entityName &&
          <div className="rating-sub-header">
            <span class="item-sub-header-component"> { entityName } </span>
          </div>
        }
        <div className="rating-inner-container">
          <span className="rating-component">{ ratingTypeName }</span>
          <span className="rating-component"> • </span>
          { foodRatingTypeMetrics && foodRatingTypeMetrics.map( (m,i) => {
            const renderBullet = i !== foodRatingTypeMetrics.length - 1
            return (
              <div>
                <span className="rating-component">{ m.symbol + m.handle }</span>
                { renderBullet && <span className="rating-component"> • </span> }
              </div>
            ) } )
          }
        </div>
      </div>
    )
  }

  render() {
    const { text, draftSocialEntry, searchStatus, selectedTagIndex, tagSuggestions  } = this.state
    const { visible } = this.props
    const { tags, creatableTags } = draftSocialEntry

    if ( !visible ) {
      return null
    }

    return (
      <div className="modal-form-container">
        <div className="modal-screen"></div>
        <div className="modal-inner-container">
          <div className="modal-section">
            <img className="close" src={ close } onClick={ this.close } alt="close-form"/>
            <div className='social-entry-form-header item-header'> New Social Entry </div>
            { this.renderRating(tags) }
          </div>
          <div className="social-entry-form">
            <textarea type="text"
              className="social-entry-form-textarea"
              value={ text }
              onChange={ this.updateText }
              onKeyDown={ this.onKeyDown }
              autoFocus
              tabIndex={ 1 }
              />

            { this.renderCurrentTags(tags, creatableTags) }

            { searchStatus && searchStatus }
            <TagSuggestions
              tagSuggestions={ tagSuggestions }
              selectedTagIndex={ selectedTagIndex }
              onClickTag={ this.addTag }
              onMouseOverTag={ (selectedTagIndex) => this.setState({ selectedTagIndex }) }
            />

            <div className="modal-section">
              <button
                className="header-button"
                tabIndex={ 2 }
                onClick={ this.onPost }
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SocialEntryInput.propTypes = {
  draftSocialEntry: PropTypes.object,
  tags: PropTypes.object,
  user: PropTypes.object,
  requestedAt: PropTypes.object,
  visible: PropTypes.bool,

  postSocialEntry: PropTypes.func,
  suggestTags: PropTypes.func,
  toggleVisibility: PropTypes.func,
  updateDraftSocialEntry: PropTypes.func,
}

export default SocialEntryInput
