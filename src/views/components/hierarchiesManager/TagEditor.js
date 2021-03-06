import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Col,
  FormControl,
  Button,
  ControlLabel,
  Well,
} from 'react-bootstrap'


class TagEditor extends Component {
  constructor(props) {
    super(props)
    const { editTaggable } = props

    this.state = {
      editTaggable,
      confirmedDelete: false,
    }
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
    if (!editTaggable.name) {
      return <div>
        No Tag Selected
      </div>
    }
    const { toggleUnselectNodes, currentUser } = this.props
    const { name, synonyms, description } = editTaggable
    const synonymsString = (synonyms && synonyms.join(', ')) || ''

    return (
      <Well bsSize="large">
        <ControlLabel>Name</ControlLabel>
        <FormControl
          type="text"
          placeholder="Name"
          value={ name }
          onChange={ e => this.updateTaggable('name', e.target.value) }
          onFocus={ () => toggleUnselectNodes(true) }
          disabled={ !currentUser }
        />

        <ControlLabel>Description</ControlLabel>
        <FormControl
          componentClass="textarea"
          placeholder="Description"
          value={ description }
          onChange={ e => this.updateTaggable('description', e.target.value) }
          onFocus={ () => toggleUnselectNodes(true) }
          rows="5"
          disabled={ !currentUser }
        />

        <ControlLabel>Synonyms</ControlLabel>
        <FormControl
          type="text"
          placeholder="Synonyms"
          value={ synonymsString }
          onChange={ e => this.updateTaggable('synonyms', e.target.value.split(', ')) }
          onFocus={ () => toggleUnselectNodes(true) }
          disabled={ !currentUser }
        />
      </Well>
    )
  }

  renderDeleteButtons = () => {
    const { currentUser } = this.props
    const { confirmedDelete, editTaggable } = this.state
    if ( !currentUser || !editTaggable.id ) {
      return null
    }
    return (
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
    )
  }

  render() {
    const { edited, visible, currentUser } = this.props
    const { editTaggable } = this.state
    const formVisible = visible && editTaggable
    let className = "tag-editor-container sidebar"
    if ( !formVisible ) {
      className += " hide-sidebar"
    }

    return (
      <div className={ className }>
        <div className='sidebar-content'>
          { formVisible &&
            <div>
              { this.renderTaggable(editTaggable) }
              { this.renderDeleteButtons() }
              { currentUser && edited &&
                <Col smOffset={2} sm={10}>
                  <Button
                    type="submit"
                    bsStyle="primary"
                    onClick={ e => this.onSaveTaggable(e) }
                  >Submit Changes</Button>
                </Col>
              }
            </div>
          }
        </div>
      </div>
    )
  }

}

TagEditor.propTypes = {
  currentUser: PropTypes.object,
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
