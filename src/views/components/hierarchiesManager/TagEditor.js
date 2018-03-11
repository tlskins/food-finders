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
    editedTaggable: {},
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      const { editedFoodRatingMetric } = nextProps
      this.setState({ editedTaggable: editedFoodRatingMetric })
    }
  }

  selectTag = metaTag => {
    const { editFoodRatingMetric } = this.props
    console.log('mettag=',metaTag)

    editFoodRatingMetric(metaTag.taggableId)
  }

  render() {
    const { visible, toggleVisibility } = this.props
    const { editedTaggable } = this.state
    const formVisible = visible && editedTaggable
    console.log('editedTaggable=',editedTaggable)

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
              {
                // <ControlLabel>Handle</ControlLabel>
                // <InputGroup className='form-title'>
                //   <InputGroup.Addon>
                //     { editedTaggable.symbol }
                //   </InputGroup.Addon>
                //   <FormControl
                //     type="text"
                //     value={ editedTaggable.handle }
                //     disabled={ true }
                //   />
                // </InputGroup>
              }

              { editedTaggable &&
                <div>
                  <Well bsSize="large">
                    <FormGroup>
                      <ControlLabel>Name</ControlLabel>
                      <FormControl
                        type="text"
                        placeholder="Name"
                        value={ editedTaggable.name }
                      />
                    </FormGroup>

                    <FormGroup>
                      <ControlLabel>Description</ControlLabel>
                      <FormControl
                        componentClass="textarea"
                        placeholder="Description"
                        value={ editedTaggable.description }
                        rows="5"
                      />
                    </FormGroup>

                    <FormGroup>
                      <ControlLabel>Synonyms</ControlLabel>
                      <FormControl
                        type="text"
                        placeholder="Synonyms"
                        value={ editedTaggable.synonyms && editedTaggable.synonyms.join(', ') }
                      />
                    </FormGroup>
                  </Well>

                  {
                    // <Well bsSize="large">
                    //   <FormGroup>
                    //     <InputGroup>
                    //       <DropdownButton
                    //         componentClass={InputGroup.Button}
                    //         title="Parent"
                    //       >
                    //         <MenuItem key="1">Change Parent</MenuItem>
                    //       </DropdownButton>
                    //       <Button
                    //         onClick={ () => this.selectTag(editTag.embeddedTaggable.parent) }
                    //       >
                    //         { editTag.embeddedTaggable.parent && editTag.embeddedTaggable.parent.name }
                    //       </Button>
                    //     </InputGroup>
                    //   </FormGroup>
                    //
                    //   <DropdownButton
                    //     title={ "Children (" + ((editTag.embeddedTaggable.children && editTag.embeddedTaggable.children.length) || 0) + ")" }
                    //   >
                    //     { editTag.embeddedTaggable.children.map( (t,i) =>
                    //       <MenuItem
                    //         eventKey={ i }
                    //         onClick={ () => this.selectTag(t) }
                    //       >
                    //         { t.name }
                    //       </MenuItem>
                    //     ) }
                    //   </DropdownButton>
                    // </Well>
                  }
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
  editedFoodRatingMetric: PropTypes.object,
  // tags: PropTypes.arrayOf(PropTypes.object),
  visible: PropTypes.bool,
  // followingCount: PropTypes.number,
  // followersCount: PropTypes.number,
  //
  editFoodRatingMetric: PropTypes.func,
  toggleVisibility: PropTypes.func,
  // updateUserRelationship: PropTypes.func,
}

export default TagEditor
