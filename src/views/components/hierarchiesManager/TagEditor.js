import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Form, Col, FormControl, Button, ControlLabel, FormGroup } from 'react-bootstrap'


class TagEditor extends Component {
  state = {
    editTag: {},
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      const { editTag } = nextProps
      this.setState({ editTag })
    }
  }

  // updateText = e => {
  //   const { searchUsersByText, users } = this.props
  //   const { value } = e.target
  //   this.setState({
  //     searchText: value,
  //     suggestions: searchDictionaryBy(users, 'name', value)
  //   })
  //   searchUsersByText && searchUsersByText(value)
  // }
  //
  // renderEditRelationshipButton = (isFollowing, targetId) => {
  //   const { updateUserRelationship } = this.props
  //   const type = isFollowing === 'Yes' ? 'unfollow' : 'follow'
  //   const buttonText = isFollowing === 'Yes' ? '-' : '+'
  //   return (
  //     <button type='button' onClick={ () => updateUserRelationship({targetId, type}) } >
  //       { buttonText }
  //     </button>
  //   )
  // }

  render() {
    const { visible, toggleVisibility } = this.props
    const { editTag } = this.state
    // const searchTextEmpty = searchText.length === 0

    return (
      <div className='tag-editor-container'>
        <div className='tag-editor--clicker'
          onClick={ () => toggleVisibility(!visible) }
        >
          <div className='tag-editor--icon'/>
        </div>
        <div className='form-container'>
          { editTag &&
            <Form horizontal>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl type="text" placeholder="Name" value={ editTag.name } />
              </FormGroup>

              { editTag.embeddedTaggable &&
                <div>
                  <FormGroup>
                    <ControlLabel>Description</ControlLabel>
                    <FormControl
                      componentClass="textarea"
                      placeholder="Description"
                      value={ editTag.embeddedTaggable.description }
                      rows="5"
                    />
                  </FormGroup>

                  <FormGroup>
                    <ControlLabel>Synonyms</ControlLabel>
                    <FormControl
                      type="text"
                      placeholder="Synonyms"
                      value={ editTag.embeddedTaggable.synonyms && editTag.embeddedTaggable.synonyms.join(', ') }
                    />
                  </FormGroup>
                </div>
              }

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type="submit">Submit Changes</Button>
                </Col>
              </FormGroup>
            </Form>
          }
        </div>
      </div>
    )
  }

}

TagEditor.propTypes = {
  editTag: PropTypes.object,
  tags: PropTypes.arrayOf(PropTypes.object),
  visible: PropTypes.bool,
  // followingCount: PropTypes.number,
  // followersCount: PropTypes.number,
  //
  suggestTags: PropTypes.func,
  toggleVisibility: PropTypes.func,
  // updateUserRelationship: PropTypes.func,
}

export default TagEditor
