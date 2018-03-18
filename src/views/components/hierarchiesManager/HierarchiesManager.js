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
	FormControl,
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
	edited: false,
	selectedTaggable: undefined,
	newTaggableName: '',
	mode: 'Select Taggable',
}

const initialDiagramsState = {
	baseRootX: 20,
  baseRootY: 30,
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
		this.props.setTagEditorTagSymbol( this.state.currentTagSymbol )
		
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
    const { edited, hierarchies, visible } = nextProps
    const { currentHierarchy } = this.state

    if ( hierarchies !== this.props.hierarchies && hierarchies[currentHierarchy] ) {
			this.loadInitialDiagramState()
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

		if ( edited !== this.state.edited ) {
			this.setState({ edited })
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
		const { edited, mode } = this.state
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

	selectParent = () => {
		const { selectedTaggable } = this.state
		const model = this.engine.getDiagramModel()
		const selectedTaggableNode = this.getNode(selectedTaggable.name, model)
		this.getOrCreateInPort(selectedTaggableNode)
		this.setState({ mode: 'Select Parent' })
		this.forceUpdate()
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
		parentTaggableNode.selected = false

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

	createTaggable = () => {
		const { toggleTagEditorVisibility, updateFoodRatingMetric } = this.props
		const { newTaggableName } = this.state
		const newTaggable = { name: newTaggableName }

		const model = this.engine.getDiagramModel()
		const newTaggableNode = new DefaultNodeModel(newTaggable.name, this.selectedNodeColor)
		newTaggableNode.setPosition(300, 200)
		newTaggableNode.addListener({ selectionChanged: (e) => this.selectTag(e, newTaggable) })

		this.setState({ selectedTaggable: newTaggable, mode: 'Select Taggable', newTaggableName: '' })
		updateFoodRatingMetric( newTaggable )
		toggleTagEditorVisibility(true)
		model.addAll(newTaggableNode)
		this.forceUpdate()
	}

	clearEdits = () => {
		const { currentHierarchy } = this.state
		const { loadHierarchy, resetFoodRatingMetric, toggleTagEditorVisibility } = this.props
		this.loadInitialDiagramState()
		loadHierarchy(currentHierarchy)
		resetFoodRatingMetric()
		toggleTagEditorVisibility(false)
		this.setState({ selectedTaggable: undefined, mode: 'Select Taggable'})
	}

  render() {
    const { currentUser, visible } = this.props
    const { currentHierarchyName, edited, mode, selectedTaggable } = this.state

		const selectTaggableMode = mode === 'Select Taggable'
		const createTaggableMode = mode === 'Create Taggable'

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
									{ !edited && selectTaggableMode &&
										<Button
											onClick={ () => {
												this.clearEdits()
												this.setState({ mode: 'Create Taggable'})
											}}>
											New { currentHierarchyName }
										</Button>
									}
									{ !edited && createTaggableMode &&
										<div>
											<FormControl
												type="text"
												placeholder={ currentHierarchyName + ' Name' }
												onChange={ e => this.setState({ newTaggableName: e.target.value }) }
											/>
											<Button onClick={ this.createTaggable }>Create</Button>
										</div>
									}
									{ selectedTaggable && selectedTaggable.parentId &&
										<Button onClick={ this.unlinkTaggable }>Unlink Parent</Button>
									}
									{ selectedTaggable && !selectedTaggable.parentId &&
										<Button onClick={ this.selectParent }>Link Parent</Button>
									}
									{ edited &&
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
