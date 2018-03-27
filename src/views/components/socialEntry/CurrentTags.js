import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'


class CurrentTags extends PureComponent {
  render() {
    const { tags, creatableTags } = this.props
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
}


CurrentTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  creatableTags: PropTypes.arrayOf(PropTypes.object),
}


export default CurrentTags
