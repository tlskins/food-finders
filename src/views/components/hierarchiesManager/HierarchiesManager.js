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

import './test.css'

import NavBar from '@containers/common/Navbar'
import TagEditor from '@containers/hierarchiesManager/TagEditor'

const HierarchySymbolMatric = {
  FoodRatingMetric: '&',
  FoodRatingType: '#',
}

class HierarchiesManager extends Component {
  state = {
    currentHierarchy: 'FoodRatingMetric',
    currentTagSymbol: '&',
    selectedTag: undefined,
    tree: undefined,
    locked: false,
  }
  baseRootX = 20
  baseRootY = 20
  nodeXDistance = 100
  nodeYDistance = 70

  componentDidMount() {
    this.engine = new DiagramEngine()
    this.engine.registerNodeFactory(new DefaultNodeFactory())
    this.engine.registerLinkFactory(new DefaultLinkFactory())

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
    const { hierarchies } = nextProps
    const { currentHierarchy, locked } = this.state

    if ( hierarchies !== this.props.hierarchies && hierarchies[currentHierarchy] ) {
      console.log('trigger re draw!')
      const model = new DiagramModel()
      const tree = hierarchies[currentHierarchy].tree
      Object.values(tree).forEach( (v,i) => this.addRootNode(v, i, model))

      model.setLocked(locked)
      this.engine.setDiagramModel(model)
      // trigger re render
      this.setState({ tree })
    }
  }

  addRootNode = (taggable, index, model) => {
    const rootNode = new DefaultNodeModel(taggable.name, 'rgb(0,192,255)')
    rootNode.setPosition(this.baseRootX, this.baseRootY)
    rootNode.addListener({ selectionChanged: () => { this.selectTag(taggable) } })
    const rootPort = rootNode.addOutPort("parent")
    model.addAll(rootNode)

    if ( taggable.children ) {
      this.addChildrenNodes(rootNode, rootPort, taggable, model, this.baseRootX, this.baseRootY)
    }
  }

  addChildrenNodes = (parentNode, parentPort, parentTaggable, model, parentX, parentY) => {
    if ( parentTaggable.children ) {
      Object.values(parentTaggable.children).forEach( (v,i) => {
        const childNode = new DefaultNodeModel(v.name, "rgb(192,255,0)")
        childNode.addListener({ selectionChanged: () => { this.selectTag(v) } })
        const childPort = childNode.addInPort("child")
        childNode.setPosition(parentX + this.nodeXDistance, parentY + (this.nodeYDistance * i))
        this.baseRootY += this.nodeYDistance
        const link = parentPort.link(childPort)
        model.addAll(childNode, link)

        if ( v.children ) {
          this.addChildrenNodes(childNode, childPort, v, 0, model)
        }
      })
    }
  }

  selectTag = (tag) => {
    const { editTag } = this.props
    const { currentTagSymbol } = this.state

    editTag(currentTagSymbol, tag)

    this.setState({ selectedTag: tag })
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
  // friendsManagerVisible: PropTypes.bool,
  // socialEntryVisible: PropTypes.bool,
  //
  loadHierarchy: PropTypes.func,
  redirect: PropTypes.func,
  editTag: PropTypes.func,
}

export default HierarchiesManager
