import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
	DiagramWidget,
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	LinkModel
} from 'storm-react-diagrams'
import 'storm-react-diagrams/dist/style.min.css'
import {
	ButtonToolbar,
	ButtonGroup,
  Button,
} from 'react-bootstrap'

import './test.css'

import NavBar from '@containers/common/Navbar'
import TagEditor from '@containers/hierarchiesManager/TagEditor'

const HierarchySymbolMatrix = {
  FoodRatingMetric: { symbol: '&', name: 'Rating Metric' },
  FoodRatingType: { symbol: '#', name: 'Rating Type' },
}

const initialState = {
	currentHierarchy: 'FoodRatingMetric',
	currentTagSymbol: '&',
	currentHierarchyName: 'Rating Metric',
	selectedTaggable: undefined,
	mode: 'Select Taggable',
	tree: undefined,
}

const initialDiagramsState = {
	baseRootX: 20,
  baseRootY: 20,
  nodeXDistance: 100,
  nodeYDistance: 70,
	tree: {},
	dictionary: {},
	nodeMapper: {},
	linkToParentMapper: {},
	nodeColor: "rgb(0,192,255)",
	selectedNodeColor: "rgb(192,255,0)",
}

class HierarchiesManager extends Component {
  state = { ...initialState }
	engine = new DiagramEngine()

  componentDidMount() {
    this.engine.registerNodeFactory(new DefaultNodeFactory())
    this.engine.registerLinkFactory(new DefaultLinkFactory())
		this.props.setTagEditorTagSymbol( this.state.currentTagSymbol )
		this.loadInitialDiagramState()

    setTimeout(() => {
      const { currentUser, redirect, loadHierarchy } = this.props
      if ( !currentUser ) {
        redirect()
      }
      else {
        ( async() => await loadHierarchy(this.state.currentHierarchy) )()
      }
    }, 100 )
  }

  componentWillReceiveProps = (nextProps) => {
    const { hierarchies, visible } = nextProps
    const { currentHierarchy } = this.state

    if ( hierarchies !== this.props.hierarchies && hierarchies[currentHierarchy] ) {
      const model = new DiagramModel()
			console.log('trigger re draw!, model=',model)
			const { dictionary, tree } = hierarchies[currentHierarchy]
			this.dictionary = dictionary
      Object.values(tree).forEach( (v,i) => this.addRootNode(v, i, model))

      model.setLocked(!visible)
      this.engine.setDiagramModel(model)
			this.forceUpdate()
    }
    else {
			if ( visible !== this.props.visible ) {
	      console.log('trigger model lock!')
	      let model = this.engine.getDiagramModel()
	      model.setLocked(!visible)
	      this.forceUpdate()
			}
    }
  }

	loadInitialDiagramState = () => {
		Object.entries(initialDiagramsState).forEach( e => {
			this[e[0]] = e[1]
		})
	}

  addRootNode = (taggable, index, model) => {
    const rootNode = new DefaultNodeModel(taggable.name, this.nodeColor)
    rootNode.setPosition(this.baseRootX, this.baseRootY)
    rootNode.addListener({ selectionChanged: (e) => this.selectTag(e, taggable) })
    // const rootPort = rootNode.addOutPort("parent")
    model.addAll(rootNode)
		console.log('added root node=',rootNode)

    if ( taggable.children ) {
      this.addChildrenNodes(rootNode, taggable, model, this.baseRootX, this.baseRootY)
    }
  }

  addChildrenNodes = (parentNode, parentTaggable, model, parentX, parentY) => {
    if ( parentTaggable.children ) {
      Object.values(parentTaggable.children).forEach( (v,i) => {
				const childNode = new DefaultNodeModel(v.name, this.nodeColor)
				v.parentId = parentTaggable.id
        childNode.addListener({ selectionChanged: (e) => this.selectTag(e, v) })
        childNode.setPosition(parentX + this.nodeXDistance, parentY + (this.nodeYDistance * i))
        this.baseRootY += this.nodeYDistance
				const link = this.linkFromTo(childNode, parentNode)
				console.log('added link=',link)
        model.addAll(childNode, link)

        if ( v.children ) {
          this.addChildrenNodes(childNode, v, 0, model)
        }
      })
    }
  }

  selectTag = (e, taggable) => {
		const { mode } = this.state
		const { edited } = this.props
		const oldTaggable = this.state.selectedTaggable
		if ( e.isSelected ) {
			if ( !edited && mode === 'Select Taggable' ) {
				const { editTag, loadFoodRatingMetric } = this.props
				const { currentTagSymbol } = this.state

				// update selected / unselected node colors
				const model = this.engine.getDiagramModel()
				if ( oldTaggable ) {
					const oldTaggableNode = this.getNode(oldTaggable.name, model)
					oldTaggableNode.color = this.nodeColor
				}
				const selectedTaggableNode = this.getNode(taggable.name, model)
				selectedTaggableNode.color = this.selectedNodeColor

				this.engine.setDiagramModel(model)
				this.forceUpdate()
				loadFoodRatingMetric(taggable.id)
				editTag(currentTagSymbol, taggable.handle)
				this.setState({ selectedTaggable: taggable })
			}
			else if ( mode === 'Select Parent' && oldTaggable && oldTaggable.id !== taggable.id ) {
				this.linkTaggable(taggable)
			}
		}
  }

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
			outPort = node.addOutPort("parent")
		}
		return outPort
	}

	getOrCreateInPort = (node) => {
		let inPort = node && node.getInPorts()[0]
		if ( !inPort ) {
			inPort = node.addInPort("child")
		}
		return inPort
	}

	// updateNode = (taggable) => {
	// 	// const { setHierarchiesManagerStatus } = this.props
	// 	const model = this.engine.getDiagramModel()
	// 	const parentTaggable = this.dictionary[taggable.parentId]
	//
	// 	const taggableNode = this.getNode(taggable.name, model)
	// 	const parentTaggableNode = parentTaggable && this.getNode(parentTaggable.name, model)
	// 	const toParent = this.getToParentLink(taggable.name, model)
	// 	const toParentLink = toParent && toParent['link']
	// 	const childPort = toParent && toParent['port']
	//
	// 	if ( parentTaggable && !toParentLink ) {
	// 		const link = this.linkFromTo(taggableNode, parentTaggableNode)
	// 		model.addAll(link)
	// 	}
	// 	else if ( !parentTaggable && toParentLink ){
	// 		childPort.removeLink(toParentLink)
	// 		model.removeLink(toParentLink)
	// 	}
	// 	else if ( parentTaggable && toParentLink ) {
	// 		toParentLink.setSourcePort(this.getOrCreateOutPort(parentTaggableNode))
	// 	}
	// 	console.log('model after updatenode=',model)
	// 	this.engine.setDiagramModel(model)
	// 	this.forceUpdate()
	// }

	unlinkTaggable = e => {
		e.preventDefault()
		const { selectedTaggable } = this.state
		let { editedFoodRatingMetric } = this.props
		const { updateFoodRatingMetric } = this.props

		const model = this.engine.getDiagramModel()
		const parentTaggable = this.dictionary[selectedTaggable.parentId]

		if ( parentTaggable ) {
			const toParent = this.getToParentLink(selectedTaggable.name, model)
			const toParentLink = toParent && toParent['link']
			const childPort = toParent && toParent['port']

			if ( toParentLink ) {
				childPort.removeLink(toParentLink)
				model.removeLink(toParentLink)
				console.log('model after unlinkTaggable=',model)
				editedFoodRatingMetric = { ...editedFoodRatingMetric, parentId: null }
				console.log('editedFoodRatingMetric after unlinkTaggable=',editedFoodRatingMetric)
				this.setState({ selectedTaggable: { ...selectedTaggable, parentId: null }})
				updateFoodRatingMetric(editedFoodRatingMetric)
				this.forceUpdate()
			}
		}
	}

	linkTaggable = parentTaggable => {
		const { selectedTaggable } = this.state
		let { editedFoodRatingMetric } = this.props
		const { updateFoodRatingMetric } = this.props

		const model = this.engine.getDiagramModel()
		const taggableNode = this.getNode(selectedTaggable.name, model)
		const parentTaggableNode = parentTaggable && this.getNode(parentTaggable.name, model)
		const toParent = this.getToParentLink(selectedTaggable.name, model)
		const toParentLink = toParent && toParent['link']

		if ( parentTaggable && !toParentLink ) {
			const link = this.linkFromTo(taggableNode, parentTaggableNode)
			model.addAll(link)
			console.log('model after linkTaggable=',model)
			editedFoodRatingMetric = { ...editedFoodRatingMetric, parentId: parentTaggable.id }
			console.log('editedFoodRatingMetric after linkTaggable=',editedFoodRatingMetric)
			this.setState({ selectedTaggable: { ...selectedTaggable, parentId: parentTaggable.id }})
			updateFoodRatingMetric(editedFoodRatingMetric)
			this.engine.setDiagramModel(model)
			this.forceUpdate()
		}
	}

	clearEdits = () => {
		const { currentHierarchy } = this.state
		const { loadHierarchy, resetFoodRatingMetric, toggleTagEditorVisibility } = this.props
		this.loadInitialDiagramState()
		loadHierarchy(currentHierarchy)
		resetFoodRatingMetric()
		toggleTagEditorVisibility(false)
		this.setState({ selectedTaggable: undefined})
	}

  render() {
    const { currentUser, edited, visible } = this.props
    const { currentHierarchyName, selectedTaggable } = this.state

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
							<ButtonToolbar className='hierarchies-manager-button'>
								<ButtonGroup>
									<Button onClick={ () => this.engine.zoomToFit() }>
										Zoom To Fit
									</Button>
									{ !edited &&
										<Button>Create { currentHierarchyName }</Button>
									}
									{ selectedTaggable && selectedTaggable.parentId &&
										<Button onClick={ this.unlinkTaggable }>Unlink Parent</Button>
									}
									{ selectedTaggable && !selectedTaggable.parentId &&
										<Button onClick={ () => this.setState({ mode: 'Select Parent' }) }>Link Parent</Button>
									}
									{ selectedTaggable && edited &&
										<Button onClick={ this.clearEdits }>Clear Edits</Button>
									}
								</ButtonGroup>
							</ButtonToolbar>
              <DiagramWidget { ...props } />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

HierarchiesManager.propTypes = {
  currentUser: PropTypes.object,
  hierarchies: PropTypes.object,
	status: PropTypes.string,
	edited: PropTypes.bool,

  loadHierarchy: PropTypes.func,
  redirect: PropTypes.func,
  editTag: PropTypes.func,
  loadFoodRatingMetric: PropTypes.func,
	resetFoodRatingMetric: PropTypes.func,
	toggleTagEditorVisibility: PropTypes.func,
	updateFoodRatingMetric: PropTypes.func,
}

export default HierarchiesManager
