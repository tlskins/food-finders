import React, { Component } from 'react'
import PropTypes from 'prop-types'


const TaggableTypes = [
	{ taggableType: 'food_rating_metrics', taggableName: 'Rating Metric' },
	{ taggableType: 'food_rating_types', taggableName: 'Rating Type' },
]

class TaggableManagerHeader extends Component {
  render() {
    const {
      activeTaggableName,
      setHierarchiesManagerTaggable,
      tagEditorVisible,
      toggleTagEditorVisibility,
    } = this.props

    return (
      <div className="sticky-header taggable-mgr-header">
        <div className="sticky-sidebar-toggle"
          onClick={ () => toggleTagEditorVisibility(!tagEditorVisible) }
        >
          Tag Editor
        </div>
        <div className="sticky-header-title">Tag Manager</div>
        { TaggableTypes.map( t => {
          let btnClassName = "header-button"
          if ( activeTaggableName === t.taggableName ) {
            btnClassName += " active-header-button"
          }

          return (
            <button
                onClick={ () => setHierarchiesManagerTaggable(t.taggableType, t.taggableName) }
                className={ btnClassName }
              >
              { t.taggableName }
            </button> )
          } )
        }
        </div> )
  }
}

TaggableManagerHeader.propTypes = {
  tagEditorVisible: PropTypes.bool,
  activeTaggableName: PropTypes.string,

  setHierarchiesManagerTaggable: PropTypes.func,
	toggleTagEditorVisibility: PropTypes.func,
}

export default TaggableManagerHeader
