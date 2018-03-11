import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Form,
  Col,
  FormControl,
  Button,
  ControlLabel,
  FormGroup,
  InputGroup,
  Well,
  MenuItem,
  DropdownButton,
} from 'react-bootstrap'


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

  selectTag = metaTag => {
    const { updateTag } = this.props
    const { tagHandle, tagSymbol } = metaTag
    const tag = { handle: tagHandle, symbol: tagSymbol }

    updateTag(tagSymbol, tag)
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
    const formVisible = visible && editTag
    console.log('edittag=',editTag)

    return (
      <div className='tag-editor-container'>
        <div className='tag-editor--clicker'
          onClick={ () => toggleVisibility(!visible) }
        >
          <div className='tag-editor--icon'/>
        </div>
        <div className='form-container'>
          { formVisible &&
            <Form vertical={ true } >
              <ControlLabel>Handle</ControlLabel>
              <InputGroup className='form-title'>
                <InputGroup.Addon>
                  { editTag.symbol }
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  value={ editTag.handle }
                  disabled={ true }
                />
              </InputGroup>

              { editTag.embeddedTaggable &&
                <div>
                  <Well bsSize="large">
                    <FormGroup>
                      <ControlLabel>Name</ControlLabel>
                      <FormControl
                        type="text"
                        placeholder="Name"
                        value={ editTag.embeddedTaggable.name }
                      />
                    </FormGroup>

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
                  </Well>

                  <Well bsSize="large">
                    <FormGroup>
                      <InputGroup>
                        <DropdownButton
                          componentClass={InputGroup.Button}
                          title="Parent"
                        >
                          <MenuItem key="1">Change Parent</MenuItem>
                        </DropdownButton>
                        <Button
                          onClick={ () => this.selectTag(editTag.embeddedTaggable.parent) }
                        >
                          { editTag.embeddedTaggable.parent && editTag.embeddedTaggable.parent.name }
                        </Button>
                      </InputGroup>
                    </FormGroup>

                    <DropdownButton
                      title={ "Children (" + ((editTag.embeddedTaggable.children && editTag.embeddedTaggable.children.length) || 0) + ")" }
                    >
                      { editTag.embeddedTaggable.children.map( (t,i) =>
                        <MenuItem
                          eventKey={ i }
                          onClick={ () => this.selectTag(t) }
                        >
                          { t.name }
                        </MenuItem>
                      ) }
                    </DropdownButton>
                  </Well>
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
  updateTag: PropTypes.func,
  toggleVisibility: PropTypes.func,
  // updateUserRelationship: PropTypes.func,
}

export default TagEditor
