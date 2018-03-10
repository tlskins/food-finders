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

class HierarchiesManager extends Component {
  state = {
    currentHierarchy: 'FoodRatingMetric',
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
    rootNode.addListener({ selectionChanged: () => { console.log('selectionchanged!') } })
    const rootPort = rootNode.addOutPort("children")
    model.addAll(rootNode)

    if ( taggable.children ) {
      this.addChildrenNodes(rootNode, rootPort, taggable, model, this.baseRootX, this.baseRootY)
    }
  }

  addChildrenNodes = (parentNode, parentPort, parentTaggable, model, parentX, parentY) => {
    if ( parentTaggable.children ) {
      Object.values(parentTaggable.children).forEach( (v,i) => {
        const childNode = new DefaultNodeModel(v.name, "rgb(192,255,0)")
        childNode.addListener({ selectionChanged: () => { console.log('selectionchanged!') } })
        const childPort = childNode.addInPort("parent")
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

  // saveModel = () => {
  //   console.log("saving model")
  //   const engine = this.state.engine
  //   const model = engine.getDiagramModel()
  //   this.setState({ saved : JSON.stringify(model.serializeDiagram()) })
  // }
  //
  // clear = () => {
  //   console.log("clearing")
  //   const engine = this.state.engine
  //   const model = engine.getDiagramModel()
  //   const nodes = model.getNodes()
  //   const links = model.getLinks()
  //
  //   let item = {}
  //   for (item in links) {
  //     model.removeLink(item)
  //   }
  //
  //   for(item in nodes){
  //     model.removeNode(item)
  //   }
  //
  //   engine.version += 1
  //   this.setState({ engine })
  // }
  //
  // loadModel = () => {
  //   if(!this.state.saved) {
  //     return null
  //   }
  //
  //   const engine = this.state.engine
  //   const model = new SRD.DiagramModel()
  //   console.log("loading model")
  //
  //   engine.setDiagramModel(model)
  //   const diagram = JSON.parse(this.state.saved)
  //   model.deSerializeDiagram(diagram, engine)
  //   engine.version += 1
  //   this.setState({ engine })
  // }

  render() {
    const { currentUser } = this.props

    if ( !currentUser || !this.engine ) {
      return null
    }

    let props = {
  		diagramEngine: this.engine,
  		allowLooseLinks: false,
      maxNumberPointsPerLink: 0,
  	}

    return (
      <div>
        <NavBar />
        <div className={ 'hierarchies-manager-page' }>
          <div>
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
}

export default HierarchiesManager
