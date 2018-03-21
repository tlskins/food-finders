import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
	DiagramWidget,
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	// DefaultPortModel,
	// LinkModel
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

const TaggableCrosswalk = {
  FoodRatingMetric: { symbol: '&', name: 'Rating Metric' },
  FoodRatingType: { symbol: '#', name: 'Rating Type' },
}

const initialState = {
	taggableType: 'food_rating_metrics',
	taggableName: 'Rating Metric',
	taggables: undefined,
	rootTaggables: {},
	edited: false,
	selectedTaggable: undefined,
	newTaggableName: '',
	mode: 'Select Taggable',
}

const initialDiagramsState = {
	baseRootX: 20,
  baseRootY: 30,
	maxNodeY: 30,
  nodeXDistance: 100,
  nodeYDistance: 70,
	dictionary: {},
	nodeColor: "rgb(0,192,255)",
	selectedNodeColor: "rgb(192,255,0)",
}

class HierarchiesManager extends Component {
  state = { ...initialState }
	engine = new DiagramEngine()

  componentDidMount() {
    this.engine.registerNodeFactory(new DefaultNodeFactory())
    this.engine.registerLinkFactory(new DefaultLinkFactory())
    setTimeout(() => {
			const { taggableType } = this.state
      const { allTaggables, currentUser, redirect, loadTaggables } = this.props
      if ( !currentUser ) {
        redirect()
      }
      else {
        ( async() => {
					if (!allTaggables[taggableType]) {
						await loadTaggables(taggableType)
					}
					else {
						const taggables = allTaggables[taggableType]
						this.setTaggables(taggables)
					}
				} )()
      }
    }, 100 )
  }

  componentWillReceiveProps = (nextProps) => {
    const { edited, editTaggable, allTaggables, toggleUnselectNodes, unselectNodes } = nextProps
    const { selectedTaggable, taggableType, taggables } = this.state
		const newTaggables = allTaggables && allTaggables[taggableType]
		if ( (!taggables && newTaggables) || newTaggables !== taggables ) {
			this.setTaggables(newTaggables)
    }

		if ( unselectNodes ) {
			const model = this.engine.getDiagramModel()
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

		if ( newState ) {
			this.setState( newState )
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

	setTaggables = taggables => {
		this.loadInitialDiagramState()
		console.log('trigger reload taggables')
		const rootTaggables = Object.values(taggables).filter( t => !t.parentId )
		this.setState({ taggables, rootTaggables }, () => this.diagramTaggables() )
	}

	diagramTaggables = () => {
		const { rootTaggables } = this.state
		const model = new DiagramModel()
		rootTaggables.forEach( (t, i) => this.recursiveAddTaggableNode(t, null, i, model) )
		// model.setLocked(!visible)
		this.engine.setDiagramModel(model)
		this.forceUpdate()
	}

	recursiveAddTaggableNode = ( taggable, parentNode, index, model ) => {
		const { taggables } = this.state
    const node = new DefaultNodeModel(taggable.name, this.nodeColor)
		this.getOrCreateOutPort(node)
    node.addListener({ selectionChanged: (e) => this.selectTag(e, taggable) })
		if ( parentNode) {
			const { x, y } = parentNode
			node.setPosition(x + this.nodeXDistance, y + (this.nodeYDistance * index))
			const link = this.linkFromTo(node, parentNode)
			console.log('added link=',link)
			model.addAll(node, link)
		}
		else {
			node.setPosition(this.baseRootX, this.maxNodeY + (this.nodeYDistance * index))
			model.addAll(node)
		}

		if ( node.y > this.maxNodeY ) {
			this.maxNodeY = node.y
		}
		console.log('added node=',node)

		const childrenTaggables = Object.values(taggables).filter( t => t.parentId === taggable.id )
    if ( childrenTaggables.length > 0 ) {
			childrenTaggables.forEach( (t, i) => this.recursiveAddTaggableNode(t, node, i, model) )
    }
  }

  selectTag = (e, taggable) => {
		console.log('selectag e=',e)
		const { edited, mode } = this.state
		const oldTaggable = this.state.selectedTaggable
		if ( e.isSelected ) {
			if ( !edited && mode === 'Select Taggable' ) {
				// update selected / unselected node colors
				const model = this.engine.getDiagramModel()
				if ( oldTaggable ) {
					const oldTaggableNode = this.getNode(oldTaggable.name, model)
					oldTaggableNode.color = this.nodeColor
				}
				const selectedTaggableNode = this.getNode(taggable.name, model)
				selectedTaggableNode.color = this.selectedNodeColor
				selectedTaggableNode.selected = false

				const { loadEditTaggable, toggleTagEditorVisibility } = this.props
				this.engine.setDiagramModel(model)
				this.forceUpdate()
				this.setState({ selectedTaggable: taggable })
				loadEditTaggable(taggable)
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
			// this.setState({ selectedTaggable: undefined, mode: 'Select Taggable'}, () => this.setTaggables(taggables))
			this.setState({ mode: 'Select Taggable'}, () => this.setTaggables(taggables))
		}
		else {
			// this.setState({ selectedTaggable: undefined, mode: 'Select Taggable'})
			this.setState({ mode: 'Select Taggable'})
		}
		resetTaggable()
		toggleTagEditorVisibility(false)
	}

	// Diagram Helpers

	getNode = (name, model) => {
		return Object.values(model.nodes).find( n => n.name === name )
	}

	getToParentLink = (nodeName, model) => {
		const node = this.getNode(nodeName, model)
		if ( node ) {
			const firstPort = Object.values(node.ports)[0]
			if ( firstPort && firstPort.in ) {
				return { port: firstPort, link: Object.values(firstPort.links)[0] }
			}
		}
		return undefined
	}

	linkFromTo = (childNode, parentNode) => {
		const parentOutPort = this.getOrCreateOutPort(parentNode)
		const childInPort = this.getOrCreateInPort(childNode)
		const link = parentOutPort.link(childInPort)
		link.setColor('Black')
		link.setWidth(7)
		return link
	}

	getOrCreateOutPort = (node) => {
		let outPort = node && node.getOutPorts()[0]
		if ( !outPort ) {
			outPort = node.addOutPort(" ")
		}
		return outPort
	}

	getOrCreateInPort = (node) => {
		let inPort = node && node.getInPorts()[0]
		if ( !inPort ) {
			inPort = node.addInPort(" ")
		}
		return inPort
	}

	unlinkTaggable = e => {
		e.preventDefault()
		let { selectedTaggable } = this.state
		const { taggables } = this.state
		const { updateTaggable } = this.props
		const model = this.engine.getDiagramModel()
		const parentTaggable = taggables[selectedTaggable.parentId]

		if ( parentTaggable ) {
			const toParent = this.getToParentLink(selectedTaggable.name, model)
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
		const selectedTaggableNode = this.getNode(selectedTaggable.name, model)
		this.getOrCreateInPort(selectedTaggableNode)
		this.setState({ mode: 'Select Parent' })
		this.forceUpdate()
	}

	linkTaggable = parentTaggable => {
		let { selectedTaggable } = this.state
		const { updateTaggable } = this.props

		const model = this.engine.getDiagramModel()
		const taggableNode = this.getNode(selectedTaggable.name, model)
		const parentTaggableNode = parentTaggable && this.getNode(parentTaggable.name, model)
		const toParent = this.getToParentLink(selectedTaggable.name, model)
		const toParentLink = toParent && toParent['link']
		parentTaggableNode.selected = false

		if ( parentTaggable && !toParentLink ) {
			const link = this.linkFromTo(taggableNode, parentTaggableNode)
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
		const { toggleTagEditorVisibility, updateTaggable } = this.props
		const { newTaggableName } = this.state
		const newTaggable = { name: newTaggableName }

		const model = this.engine.getDiagramModel()
		const newTaggableNode = new DefaultNodeModel(newTaggable.name, this.selectedNodeColor)
		newTaggableNode.setPosition(this.baseRootX, this.baseRootY)
		newTaggableNode.addListener({ selectionChanged: (e) => this.selectTag(e, newTaggable) })
		newTaggableNode.selected = false

		this.setState({ selectedTaggable: newTaggable, mode: 'Select Taggable', newTaggableName: '' })
		updateTaggable( newTaggable )
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
		const canEditRelations = edited || (selectedTaggable && selectedTaggable.id)

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
    const { currentUser, visible } = this.props
		if ( !currentUser || !this.engine ) {
      return null
    }
    let props = {
  		diagramEngine: this.engine,
  		allowLooseLinks: false,
      maxNumberPointsPerLink: 0,
  	}
    return (
      <div className="page-container">
        <NavBar />
        <div className='hierarchies-manager-page'>
					<TagEditor />
          <div className={ 'hierarchies-manager-container ' + (visible ? ' show-tag-editor': '')}>
            <div>
							{ this.renderButtons() }
              <DiagramWidget { ...props } />
            </div>
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
	// status: PropTypes.string,
	visible: PropTypes.bool,

	loadEditTaggable: PropTypes.func,
	loadTaggables: PropTypes.func,
	redirect: PropTypes.func,
	resetTaggable: PropTypes.func,
	// setHierarchiesManagerStatus: PropTypes.func,
	toggleTagEditorVisibility: PropTypes.func,
	toggleUnselectNodes: PropTypes.func,
	unselectNodes: PropTypes.func,
	updateTaggable: PropTypes.func,
}

export default HierarchiesManager
