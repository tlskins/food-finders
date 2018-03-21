import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Form,
  Col,
  FormControl,
  Button,
  ControlLabel,
  FormGroup,
  Well,
} from 'react-bootstrap'


class TagEditor extends Component {
  state = {
    editTaggable: undefined,
    confirmedDelete: false,
  }

  componentWillReceiveProps(nextProps) {
    const { editTaggable } = nextProps
    if (this.props.editTaggable !== editTaggable) {
      this.setState({ editTaggable })
    }
  }

  componentWillUnmount() {
    const { toggleVisibility } = this.props
    toggleVisibility(false)
  }

  updateTaggable = (key, value) => {
    const { updateTaggable } = this.props
    let { editTaggable } = this.state
    editTaggable[key] = value
    editTaggable = { ...editTaggable }

    this.setState({ editTaggable })

    updateTaggable(editTaggable)
  }

  onSaveTaggable = e => {
    const { editTaggable } = this.state
    const { saveTaggable, taggableType } = this.props
    e.stopPropagation()
    e.preventDefault()

    saveTaggable(taggableType, editTaggable)
  }

  deleteTaggable = e => {
    const { editTaggable } = this.state
    const { deleteTaggable, taggableType } = this.props
    e.stopPropagation()
    e.preventDefault()

    deleteTaggable(taggableType, editTaggable.id)
    this.setState({ confirmedDelete: false })
  }

  renderTaggable = (editTaggable) => {
    if ( !editTaggable ) {
      return null
    }
    const { toggleUnselectNodes } = this.props
    const { name, description } = editTaggable
    let { synonyms } = editTaggable
    if ( synonyms ) {
      synonyms = synonyms.join(', ')
    }
    return (
      <Well bsSize="large">
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            placeholder="Name"
            value={ name }
            onChange={ e => this.updateTaggable('name', e.target.value) }
            onFocus={ () => toggleUnselectNodes(true) }
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            componentClass="textarea"
            placeholder="Description"
            value={ description }
            onChange={ e => this.updateTaggable('description', e.target.value) }
            onFocus={ () => toggleUnselectNodes(true) }
            rows="5"
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Synonyms</ControlLabel>
          <FormControl
            type="text"
            placeholder="Synonyms"
            value={ synonyms }
            onChange={ e => this.updateTaggable('synonyms', e.target.value.split(', ')) }
            onFocus={ () => toggleUnselectNodes(true) }
          />
        </FormGroup>
      </Well>
    )
  }

  renderDeleteButtons = () => {
    const { confirmedDelete, editTaggable } = this.state
    if ( !editTaggable.id ) {
      return null
    }
    return (
      <FormGroup>
        <Col smOffset={2} sm={10}>
          { confirmedDelete ?
            <Button
              type="submit"
              bsStyle="warning"
              onClick={ e => this.deleteTaggable(e) }
            >Confirm Delete?</Button>
            :
            <Button
              type="submit"
              bsStyle="info"
              onClick={ e => {
                e.preventDefault()
                this.setState({ confirmedDelete: true })
              }}
            >Delete</Button>
          }
        </Col>
      </FormGroup>
    )
  }

  render() {
    const { edited, visible, toggleVisibility } = this.props
    const { editTaggable } = this.state
    const formVisible = visible && editTaggable

    return (
      <div className='tag-editor-container'>
        <div className='tag-editor--clicker'
          onClick={ () => toggleVisibility(!visible) }
        >
          <div className='tag-editor--icon'/>
        </div>
        <div className='form-container'>
          { formVisible && editTaggable &&
            <Form>
              { this.renderTaggable(editTaggable) }
              { this.renderDeleteButtons() }
              { edited &&
                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <Button
                      type="submit"
                      bsStyle="primary"
                      onClick={ e => this.onSaveTaggable(e) }
                    >Submit Changes</Button>
                  </Col>
                </FormGroup>
              }
            </Form>
          }
        </div>
      </div>
    )
  }

}

TagEditor.propTypes = {
  edited: PropTypes.bool,
  editTaggable: PropTypes.object,
  taggableType: PropTypes.string,
  visible: PropTypes.bool,

  loadTaggables: PropTypes.func,
  saveTaggable: PropTypes.func,
  toggleUnselectNodes: PropTypes.func,
  toggleVisibility: PropTypes.func,
  updateTaggable: PropTypes.func,
}

export default TagEditor
