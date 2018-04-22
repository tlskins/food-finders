import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
	DiagramWidget,
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
} from 'storm-react-diagrams'
import 'storm-react-diagrams/dist/style.min.css'
import {
	ButtonToolbar,
	ButtonGroup,
  Button,
	FormControl,
} from 'react-bootstrap'

import './test.css'

import NavBar from '@containers/common/Navbar'
import TagEditor from '@containers/hierarchiesManager/TagEditor'
import TaggableManagerHeader from './TaggableManagerHeader'
import {
	initialDiagramsState,
	getNode,
	getToParentLink,
	linkFromTo,
	getOrCreateOutPort,
	getOrCreateInPort,
} from './DiagramHelpers'


const initialState = {
	taggableType: undefined,
	taggableName: undefined,
	mode: 'Select Taggable',
	taggables: undefined,
	rootTaggables: {},
	edited: false,
	selectedTaggable: undefined,
	newTaggableName: '',
}

class HierarchiesManager extends Component {
	engine = new DiagramEngine()

	constructor(props) {
		super(props)
		const { hierarchiesManager } = props

		this.state = {
			...initialState,
			taggableType: hierarchiesManager.taggableType,
			taggableName: hierarchiesManager.taggableName,
		}
	}

  componentDidMount() {
		window.scrollTo(0, 0)
    this.engine.registerNodeFactory(new DefaultNodeFactory())
    this.engine.registerLinkFactory(new DefaultLinkFactory())
    setTimeout(() => {
			const { currentUser, redirect } = this.props
      if ( !currentUser ) {
        redirect()
      }
      else {
				this.loadOrSetTaggables()
      }
    }, 100 )
  }

  componentWillReceiveProps = (nextProps) => {
    const { edited, editTaggable, hierarchiesManager,  allTaggables, toggleUnselectNodes, unselectNodes } = nextProps
    const { selectedTaggable, taggableType, taggables } = this.state
		const newTaggables = allTaggables && allTaggables[taggableType]
		if ( (!taggables && newTaggables) || newTaggables !== taggables ) {
			this.setTaggables(newTaggables)
    }

		const model = this.engine.getDiagramModel()
		if ( unselectNodes ) {
			toggleUnselectNodes(false)
			this.unselectNodes(model)
			this.forceUpdate()
		}

		let newState = undefined
		if ( edited !== this.props.edited ) {
			newState = { ...newState, edited }
		}

		if ( selectedTaggable && editTaggable !== this.props.editTaggable ) {
			newState = { ...newState, selectedTaggable: editTaggable }
		}

		let setStateCallback = undefined
		if ( hierarchiesManager && hierarchiesManager.taggableType !== this.props.hierarchiesManager.taggableType ) {
			newState = {
				...newState,
				taggableType: hierarchiesManager.taggableType,
				taggableName: hierarchiesManager.taggableName,
			}
			setStateCallback = this.loadOrSetTaggables
		}

		if ( newState ) {
			if ( setStateCallback ) {
				this.setState( newState, setStateCallback )
			}
			else {
				this.setState( newState )
			}
		}
  }

	componentWillUnmount() {
		this.reset()
	}

	loadInitialDiagramState = () => {
		Object.entries(initialDiagramsState).forEach( e => {
			this[e[0]] = e[1]
		})
	}

	loadInitialState = () => {
		const newState = {}
		Object.entries(initialState).forEach( e => {
			newState[e[0]] = e[1]
		})
		this.setState( newState )
	}

	loadOrSetTaggables = () => {
		console.log('loadOrSetTaggables')
		const { taggableType } = this.state
		const { allTaggables, loadTaggables } = this.props
		if (!allTaggables[taggableType]) {
			loadTaggables(taggableType)
		}
		else {
			const taggables = allTaggables[taggableType]
			this.setTaggables(taggables)
		}
	}

	setTaggables = taggables => {
		this.loadInitialDiagramState()
		console.log('setTaggables, taggables=',taggables)
		const rootTaggables = Object.values(taggables).filter( t => !t.parentId )
		this.setState({ taggables, rootTaggables }, () => this.diagramTaggables() )
	}

	diagramTaggables = () => {
		const { rootTaggables } = this.state
		const model = new DiagramModel()
		rootTaggables.forEach( (t, i) => this.recursiveAddTaggableNode(t, null, i, model) )
		this.engine.setDiagramModel(model)
		this.forceUpdate()
	}

	recursiveAddTaggableNode = ( taggable, parentNode, index, model ) => {
		const { taggables } = this.state
    const node = new DefaultNodeModel(taggable.name, this.nodeColor)
		getOrCreateOutPort(node)
    node.addListener({ selectionChanged: (e) => this.selectTag(e, taggable) })
		if ( parentNode) {
			const { x, y } = parentNode
			node.setPosition(x + this.nodeXDistance, y + (this.nodeYDistance * index))
			const link = linkFromTo(node, parentNode)
			model.addAll(node, link)
		}
		else {
			node.setPosition(this.baseRootX, this.maxNodeY + (this.nodeYDistance * index))
			model.addAll(node)
		}

		if ( node.y > this.maxNodeY ) {
			this.maxNodeY = node.y
		}

		const childrenTaggables = Object.values(taggables).filter( t => t.parentId === taggable.id )
    if ( childrenTaggables.length > 0 ) {
			childrenTaggables.forEach( (t, i) => this.recursiveAddTaggableNode(t, node, i, model) )
    }
  }

  selectTag = (e, taggable) => {
		console.log('selectag e=',e)
		const { edited, mode, taggableType } = this.state
		const { visible } = this.props
		const oldTaggable = this.state.selectedTaggable
		if ( e.isSelected ) {
			if ( !edited && mode === 'Select Taggable' ) {
				// update selected / unselected node colors
				const model = this.engine.getDiagramModel()
				if ( oldTaggable && oldTaggable.name ) {
					const oldTaggableNode = getNode(oldTaggable.name, model)
					oldTaggableNode.color = this.nodeColor
				}
				const selectedTaggableNode = getNode(taggable.name, model)
				selectedTaggableNode.color = this.selectedNodeColor
				if ( !visible ) {
					// will cause the tag editor to open which will make clicked taggable drag instead
					selectedTaggableNode.selected = false
				}

				const { loadEditTaggable, toggleTagEditorVisibility } = this.props
				this.engine.setDiagramModel(model)
				this.forceUpdate()
				this.setState({ selectedTaggable: taggable })
				loadEditTaggable(taggableType, taggable)
				toggleTagEditorVisibility(true)
			}
			else if ( mode === 'Select Parent' && oldTaggable && oldTaggable.id !== taggable.id ) {
				this.linkTaggable(taggable)
			}
		}
  }

	reset = (setTaggables = true) => {
		const { resetTaggable, toggleTagEditorVisibility } = this.props
		const { taggables } = this.state
		if ( setTaggables ) {
			this.setState({ mode: 'Select Taggable'}, () => this.setTaggables(taggables))
		}
		else {
			this.setState({ mode: 'Select Taggable'})
		}
		resetTaggable()
		toggleTagEditorVisibility(false)
	}

	unlinkTaggable = e => {
		e.preventDefault()
		let { selectedTaggable } = this.state
		const { taggables } = this.state
		const { updateTaggable } = this.props
		const model = this.engine.getDiagramModel()
		const parentTaggable = taggables[selectedTaggable.parentId]

		if ( parentTaggable ) {
			const toParent = getToParentLink(selectedTaggable.name, model)
			const toParentLink = toParent && toParent['link']
			const childPort = toParent && toParent['port']

			if ( toParentLink ) {
				childPort.removeLink(toParentLink)
				model.removeLink(toParentLink)
				console.log('model after unlinkTaggable=',model)
				selectedTaggable = { ...selectedTaggable, parentId: null }
				console.log('selectedTaggable after unlinkTaggable=',selectedTaggable)
				this.setState({ selectedTaggable })
				updateTaggable(selectedTaggable)
				this.forceUpdate()
			}
		}
	}

	selectParent = () => {
		const { selectedTaggable } = this.state
		const model = this.engine.getDiagramModel()
		const selectedTaggableNode = getNode(selectedTaggable.name, model)
		getOrCreateInPort(selectedTaggableNode)
		this.setState({ mode: 'Select Parent' })
		this.forceUpdate()
	}

	linkTaggable = parentTaggable => {
		let { selectedTaggable } = this.state
		const { updateTaggable } = this.props

		const model = this.engine.getDiagramModel()
		const taggableNode = getNode(selectedTaggable.name, model)
		const parentTaggableNode = parentTaggable && getNode(parentTaggable.name, model)
		const toParent = getToParentLink(selectedTaggable.name, model)
		const toParentLink = toParent && toParent['link']
		parentTaggableNode.selected = false

		if ( parentTaggable && !toParentLink ) {
			const link = linkFromTo(taggableNode, parentTaggableNode)
			model.addAll(link)
			console.log('model after linkTaggable=',model)
			selectedTaggable = { ...selectedTaggable, parentId: parentTaggable.id }
			console.log('selectedTaggable after linkTaggable=',selectedTaggable)
			this.setState({ selectedTaggable })
			updateTaggable(selectedTaggable)
			this.engine.setDiagramModel(model)
			this.forceUpdate()
		}
	}

	createTaggable = () => {
		const { toggleTagEditorVisibility, loadEditTaggable } = this.props
		const { newTaggableName, taggableType } = this.state
		const newTaggable = { name: newTaggableName }

		const model = this.engine.getDiagramModel()
		const newTaggableNode = new DefaultNodeModel(newTaggable.name, this.selectedNodeColor)
		newTaggableNode.setPosition(this.baseRootX, this.baseRootY)
		newTaggableNode.addListener({ selectionChanged: (e) => this.selectTag(e, newTaggable) })
		newTaggableNode.selected = false

		this.setState({ selectedTaggable: newTaggable, mode: 'Select Taggable', newTaggableName: '' })
		loadEditTaggable( taggableType, newTaggable )
		toggleTagEditorVisibility(true)
		model.addAll(newTaggableNode)
		this.forceUpdate()
	}

	unselectNodes = (model) => {
	 	Object.values(model.nodes).filter( n => n.selected === true ).forEach( n => n.selected = false )
	}

	renderButtons = () => {
		const { edited, mode, selectedTaggable, taggableName } = this.state
		const selectTaggableMode = mode === 'Select Taggable'
		const createTaggableMode = mode === 'Create Taggable'
		const canEditRelations = edited || (selectedTaggable && selectedTaggable.name)

		return(
			<ButtonToolbar className='hierarchies-manager-button'>
				<ButtonGroup>
					<Button onClick={ () => this.engine.zoomToFit() }>
						Zoom To Fit
					</Button>
					{ !edited && selectTaggableMode &&
						<Button
							onClick={ () => {
								this.reset()
								this.setState({ mode: 'Create Taggable'})
							}}>
							New { taggableName }
						</Button>
					}
					{ canEditRelations && selectedTaggable.parentId &&
						<Button onClick={ this.unlinkTaggable }>Unlink Parent</Button>
					}
					{ canEditRelations && !selectedTaggable.parentId &&
						<Button onClick={ this.selectParent }>Link Parent</Button>
					}
					{ (edited || createTaggableMode) &&
						<Button onClick={ this.reset }>Clear Edits</Button>
					}
					{ !edited && createTaggableMode &&
						<div className='hierarchies-manager-button'>
							<FormControl
								type="text"
								placeholder={ 'New ' + taggableName + ' Name' }
								onChange={ e => this.setState({ newTaggableName: e.target.value }) }
							/>
							<Button onClick={ this.createTaggable }>Create</Button>
						</div>
					}
				</ButtonGroup>
			</ButtonToolbar>
		)
	}

  render() {
    const { currentUser, toggleTagEditorVisibility, setHierarchiesManagerTaggable, visible } = this.props
		const { taggableName } = this.state
		if ( !currentUser || !this.engine ) {
      return null
    }
    let props = {
  		diagramEngine: this.engine,
  		allowLooseLinks: false,
      maxNumberPointsPerLink: 0,
  	}
		let containerClassName = "hierarchies-manager-container"
		if ( visible ) {
			containerClassName += " show-tag-editor"
		}

    return (
      <div className="page-container">
        <NavBar />
				<TaggableManagerHeader
					tagEditorVisible={ visible }
					toggleTagEditorVisibility={ toggleTagEditorVisibility }
					setHierarchiesManagerTaggable={ setHierarchiesManagerTaggable }
					activeTaggableName={ taggableName }
				/>
				<div className='hierarchies-manager-page'>
					<TagEditor />
          <div className={ containerClassName }>
						{ this.renderButtons() }
            <DiagramWidget { ...props } />
          </div>
        </div>
      </div>
    )
  }

}

HierarchiesManager.propTypes = {
	allTaggables: PropTypes.object,
	edited: PropTypes.bool,
	editTaggable: PropTypes.object,
	currentUser: PropTypes.object,
	hierarchiesManager: PropTypes.object,
	visible: PropTypes.bool,

	loadEditTaggable: PropTypes.func,
	loadTaggables: PropTypes.func,
	redirect: PropTypes.func,
	resetTaggable: PropTypes.func,
	setHierarchiesManagerTaggable: PropTypes.func,
	toggleTagEditorVisibility: PropTypes.func,
	toggleUnselectNodes: PropTypes.func,
	unselectNodes: PropTypes.func,
	updateTaggable: PropTypes.func,
}

export default HierarchiesManager
