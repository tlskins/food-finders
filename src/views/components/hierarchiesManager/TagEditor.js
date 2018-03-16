import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  ButtonToolbar,
  SplitButton,
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
    tag: undefined,
    editedTaggable: undefined,
    editParent: false,
  }

  componentWillReceiveProps(nextProps) {
    const { editedFoodRatingMetric, tag } = nextProps
    let newState = {}

    if (this.props.editedFoodRatingMetric !== editedFoodRatingMetric || this.props.tag !== tag) {
      newState = {
        editedTaggable: editedFoodRatingMetric,
        tag,
      }
    }
    this.setState(newState)
  }

  componentWillUnmount() {
    const { toggleVisibility } = this.props
    toggleVisibility(false)
  }

  selectTag = (id, tagSymbol, tagHandle) => {
    const { editTag, loadFoodRatingMetric } = this.props

    loadFoodRatingMetric(id)
    editTag(tagSymbol, tagHandle)
  }

  selectParent = (id) => {
    const { setHierarchiesManagerStatus } = this.props
    this.editTaggable('parentId', id)
    setHierarchiesManagerStatus('UPDATE')
    this.setState({ editParent: false })
  }

  editTaggable = (key, value) => {
    const { updateFoodRatingMetric } = this.props
    const { editedTaggable } = this.state
    editedTaggable[key] = value

    this.setState({ editedTaggable })

    updateFoodRatingMetric(editedTaggable)
  }

  saveTaggable = e => {
    const { editedTaggable } = this.state
    const { saveFoodRatingMetric } = this.props
    e.stopPropagation()
    e.preventDefault()

    saveFoodRatingMetric(editedTaggable)
  }

  renderTag = (tag) => {
    if ( !tag ) {
      return null
    }
    return (
      <InputGroup className='form-title'>
        <InputGroup.Addon>
          { tag.symbol }
        </InputGroup.Addon>
        <FormControl
          type="text"
          value={ tag.handle }
          disabled={ true }
        />
      </InputGroup>
    )
  }

  renderTaggable = (editedTaggable) => {
    if ( !editedTaggable ) {
      return null
    }
    return (
      <Well bsSize="large">
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            placeholder="Name"
            value={ editedTaggable.name }
            onChange={ e => this.editTaggable('name', e.target.value) }
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            componentClass="textarea"
            placeholder="Description"
            value={ editedTaggable.description }
            onChange={ e => this.editTaggable('description', e.target.value) }
            rows="5"
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Synonyms</ControlLabel>
          <FormControl
            type="text"
            placeholder="Synonyms"
            value={ editedTaggable.synonyms && editedTaggable.synonyms.join(', ') }
            onChange={ e => this.editTaggable('synonyms', e.target.value.split(', ')) }
          />
        </FormGroup>
      </Well>
    )
  }

  renderTaggableRelationships = (editedTaggable, tag) => {
    if ( !editedTaggable && !tag ) {
      return null
    }
    const { dictionary } = this.props
    const { editParent } = this.state
    const { id, parentId } = editedTaggable
    const parent = dictionary && parentId && dictionary[parentId]
    const parentName = (parent && parent.name) || 'None'
    const children = (tag.embeddedTaggable && tag.embeddedTaggable.children) || []
    const childrenCount = children.length
    return (
      <Well bsSize="large">
        <ControlLabel>Relationships</ControlLabel>

        <FormGroup>
          <ButtonToolbar>
            <SplitButton dropup pullLeft
              bsStyle={ parent && "primary" }
              title={ `Parent: ${ parentName }` }
              onClick={ () => parent ? this.selectTag(parent.id, tag.symbol, parent.handle) : null }
              id="parentButton"
            >
              <MenuItem eventKey="1" onClick={ () => this.setState({ editParent: true })}>
                Change Parent
              </MenuItem>
              <MenuItem eventKey="1" onClick={ () => this.selectParent()}>
                Unlink Parent
              </MenuItem>
            </SplitButton>
          </ButtonToolbar>
        </FormGroup>

        { editParent &&
          <FormGroup>
            <ButtonToolbar>
              <SplitButton dropup pullLeft
                bsStyle="primary"
                title="Select Parent"
                id="selectParentButton"
              >
                { Object.values(dictionary).filter( d => d.id !== id ).map( (d,i) =>
                  <MenuItem key={ i } eventKey={ i } onClick={ () => this.selectParent(d.id) }>
                    { d.name }
                  </MenuItem>
                ) }
              </SplitButton>
            </ButtonToolbar>
          </FormGroup>
        }

        <DropdownButton id="editChildrenTaggable" title={ "Children (" + childrenCount + ")" } >
          { children.map( (t,i) =>
            <MenuItem
              key={ i }
              eventKey={ i }
              onClick={ () => this.selectTag(t.id, t.tagSymbol, t.tagHandle) }
            >
              { t.name }
            </MenuItem>
          ) }
        </DropdownButton>
      </Well>
    )
  }

  render() {
    const { visible, toggleVisibility } = this.props
    const { editedTaggable, tag } = this.state
    const formVisible = visible && editedTaggable

    return (
      <div className='tag-editor-container'>
        <div className='tag-editor--clicker'
          onClick={ () => toggleVisibility(!visible) }
        >
          <div className='tag-editor--icon'/>
        </div>
        <div className='form-container'>
          { formVisible && editedTaggable &&
            <Form>
              { this.renderTag(tag) }
              { this.renderTaggable(editedTaggable) }
              { this.renderTaggableRelationships(editedTaggable, tag) }
              { editedTaggable.edited &&
                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <Button
                      type="submit"
                      bsStyle="primary"
                      onClick={ e => this.saveTaggable(e) }
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
  dictionary: PropTypes.object,
  editedFoodRatingMetric: PropTypes.object,
  tag: PropTypes.object,
  tagSymbol: PropTypes.string,
  visible: PropTypes.bool,

  editTag: PropTypes.func,
  loadFoodRatingMetric: PropTypes.func,
  resetHierarchiesManager: PropTypes.func,
  toggleVisibility: PropTypes.func,
  setHierarchiesManagerStatus: PropTypes.func,
  updateFoodRatingMetric: PropTypes.func,
}

export default TagEditor
